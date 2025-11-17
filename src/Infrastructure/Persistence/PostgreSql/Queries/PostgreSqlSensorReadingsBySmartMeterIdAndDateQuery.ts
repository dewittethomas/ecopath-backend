import {
    GetSensorReadingsData,
    GetAverageSensorReadingsData,
    GetGroupedAverageSensorReadingsData,
    SensorReadingRecord,
    SensorReadingsBySmartMeterIdAndDateQuery
} from 'EcoPath/Application/Contracts/mod.ts';
import { PostgreSqlClient } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import { Unit } from 'EcoPath/Domain/mod.ts';

export class PostgreSqlSensorReadingsBySmartMeterIdAndDateQuery
    implements SensorReadingsBySmartMeterIdAndDateQuery {

    constructor(private readonly db: PostgreSqlClient) {}

    async fetchAll(
        smartMeterId: string,
        from: Date,
        to: Date
    ): Promise<GetSensorReadingsData> {
        const meterRow = await this.db.findOne<{ meter_type: string }>(`
            SELECT meter_type
            FROM smart_meters
            WHERE id = $1
            LIMIT 1
        `, [smartMeterId]);

        const { meter_type } = meterRow.getOrThrow();
        const unit = meter_type === 'electricity'
            ? Unit.KilowattHour
            : Unit.CubicMeter;

        const toExclusive = new Date(to);
        toExclusive.setDate(toExclusive.getDate() + 1);

        const rows = await this.db.findMany<{
            timestamp: string;
            value: number;
        }>(`
            SELECT timestamp, value
            FROM sensor_readings
            WHERE smart_meter_id = $1
              AND timestamp >= $2
              AND timestamp < $3
            ORDER BY timestamp ASC
        `, [smartMeterId, from.toISOString(), toExclusive.toISOString()]);

        const values: SensorReadingRecord[] = rows.map(r => ({
            timestamp: new Date(r.timestamp),
            value: r.value
        }));

        return {
            smartMeterId,
            type: meter_type,
            from,
            to,
            unit,
            values
        };
    }

    async fetchAverage(
        smartMeterId: string,
        from: Date,
        to: Date
    ): Promise<GetAverageSensorReadingsData> {
        const meterRow = await this.db.findOne<{ meter_type: string }>(`
            SELECT meter_type
            FROM smart_meters
            WHERE id = $1
            LIMIT 1
        `, [smartMeterId]);

        const { meter_type } = meterRow.getOrThrow();
        const unit = meter_type === 'electricity'
            ? Unit.KilowattHour
            : Unit.CubicMeter;

        const toExclusive = new Date(to);
        toExclusive.setDate(toExclusive.getDate() + 1);

        const avgRow = await this.db.findOne<{ average: number | null }>(`
            SELECT AVG(value)::float AS average
            FROM sensor_readings
            WHERE smart_meter_id = $1
              AND timestamp >= $2
              AND timestamp < $3
        `, [smartMeterId, from.toISOString(), toExclusive.toISOString()]);

        const roundedAverage = Math.round((avgRow.getOrThrow().average ?? 0) * 100) / 100;

        return {
            smartMeterId,
            type: meter_type,
            from,
            to,
            unit,
            average: roundedAverage
        };
    }

    async fetchGroupedAverage(
        smartMeterId: string,
        from: Date,
        to: Date,
        interval: 'day' | 'week' | 'month'
    ): Promise<GetGroupedAverageSensorReadingsData> {
        const meterRow = await this.db.findOne<{ meter_type: string }>(`
            SELECT meter_type
            FROM smart_meters
            WHERE id = $1
            LIMIT 1
        `, [smartMeterId]);

        const { meter_type } = meterRow.getOrThrow();
        const unit = meter_type === 'electricity'
            ? Unit.KilowattHour
            : Unit.CubicMeter;

        const toExclusive = new Date(to);
        toExclusive.setDate(toExclusive.getDate() + 1);

        let groupExpression: string;
        switch (interval) {
            case 'day':
                groupExpression = `to_char(timestamp, 'YYYY-MM-DD')`;
                break;
            case 'week':
                groupExpression = `to_char(timestamp, 'IYYY-"W"IW')`;
                break;
            case 'month':
                groupExpression = `to_char(timestamp, 'YYYY-MM')`;
                break;
            default:
                throw new Error(`Invalid interval: ${interval}`);
        }

        const rows = await this.db.findMany<{
            period: string;
            average: number;
        }>(`
            SELECT ${groupExpression} AS period,
                   AVG(value)::float AS average
            FROM sensor_readings
            WHERE smart_meter_id = $1
              AND timestamp >= $2
              AND timestamp < $3
            GROUP BY period
            ORDER BY period ASC
        `, [smartMeterId, from.toISOString(), toExclusive.toISOString()]);

        const values: SensorReadingRecord[] = rows.map(r => ({
            timestamp: new Date(r.period),
            value: Math.round(r.average * 100) / 100
        }));

        return {
            smartMeterId,
            type: meter_type,
            from,
            to,
            unit,
            interval,
            values
        };
    }
}
