import {
    GetSensorReadingsData,
    GetAverageSensorReadingsData,
    type Interval,
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
        const { type, unit } = await this.getMeterTypeAndUnit(smartMeterId);
        const { fromIso, toIso } = this.normalizeRange(from, to);

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
        `, [smartMeterId, fromIso, toIso]);

        const values: SensorReadingRecord[] = rows.map(r => ({
            timestamp: new Date(r.timestamp),
            value: r.value
        }));

        return {
            smartMeterId,
            type,
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
        const { type, unit } = await this.getMeterTypeAndUnit(smartMeterId);
        const { fromIso, toIso } = this.normalizeRange(from, to);

        const avgRow = await this.db.findOne<{ average: number }>(`
            SELECT AVG(value)::float AS average
            FROM sensor_readings
            WHERE smart_meter_id = $1
              AND timestamp >= $2
              AND timestamp < $3
        `, [smartMeterId, fromIso, toIso]);

        const roundedAverage = Math.round((avgRow.getOrThrow().average ?? 0) * 100) / 100;

        return {
            smartMeterId,
            type,
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
        interval: Interval
    ): Promise<GetGroupedAverageSensorReadingsData> {
        const { type, unit } = await this.getMeterTypeAndUnit(smartMeterId);
        const { fromIso, toIso } = this.normalizeRange(from, to);
        const groupExpression = this.getGroupExpression(interval);

        const rows = await this.db.findMany<{
            period: string;
            average: number;
        }>(`
            SELECT ${groupExpression} AS period, AVG(value)::float AS average
            FROM sensor_readings
            WHERE smart_meter_id = $1
              AND timestamp >= $2
              AND timestamp < $3
            GROUP BY period
            ORDER BY period ASC
        `, [smartMeterId, fromIso, toIso]);

        const values: SensorReadingRecord[] = rows.map(r => ({
            timestamp: new Date(r.period),
            value: Math.round(r.average * 100) / 100
        }));

        return {
            smartMeterId,
            type,
            from,
            to,
            unit,
            interval,
            values
        };
    }

    async fetchGroupedAverageByCity(
        city: string,
        type: string,
        from: Date,
        to: Date,
        interval: Interval
    ) {
        const { fromIso, toIso } = this.normalizeRange(from, to);
        const groupExpression = this.getGroupExpression(interval);

        const rows = await this.db.findMany<{
            period: string;
            average: number;
        }>(`
            SELECT ${groupExpression} AS period, AVG(value)::float AS average
            FROM sensor_readings
            WHERE smart_meter_id IN
            (SELECT id
            FROM smart_meters
            WHERE city = $1
            AND meter_type = $2)
              AND timestamp >= $3
              AND timestamp < $4
            GROUP BY period
            ORDER BY period ASC
        `, [city, type, fromIso, toIso]);

        const values: SensorReadingRecord[] = rows.map(r => ({
            timestamp: new Date(r.period),
            value: Math.round(r.average * 100) / 100
        }));

        const unit: Unit = type === 'electricity' ? Unit.KilowattHour : Unit.CubicMeter

        return {
            city,
            type,
            from,
            to,
            unit,
            interval,
            values
        }
    }

    private async getMeterTypeAndUnit(smartMeterId: string) {
        const row = await this.db.findOne<{ meter_type: string}>(`
            SELECT meter_type
            FROM smart_meters
            WHERE id = $1
            LIMIT 1
        `, [smartMeterId]);

        const { meter_type } = row.getOrThrow();
        
        return {
            type: meter_type,
            unit: meter_type === 'electricity' ? Unit.KilowattHour : Unit.CubicMeter
        }
    }

    private normalizeRange(from: Date, to: Date) {
        const toExclusive = new Date(to);
        toExclusive.setDate(toExclusive.getDate() + 1);

        return {
            fromIso: from.toISOString(),
            toIso: toExclusive.toISOString()
        };
    }

    private getGroupExpression(interval: 'day' | 'week' | 'month') {
        switch (interval) {
            case 'day':   return `to_char(timestamp, 'YYYY-MM-DD')`;
            case 'week':  return `to_char(timestamp, 'IYYY-"W"IW')`;
            case 'month': return `to_char(timestamp, 'YYYY-MM')`;
            default: throw new Error('Invalid interval');
        }
    }
}