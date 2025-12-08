import type {
    Interval,
    SensorReadingsByCityOutput,
    AverageSensorReadingsByCityOutput,
    SensorReadingRecordData,
    SensorReadingsByCityAndDateQuery
} from 'EcoPath/Application/Contracts/mod.ts';
import { PostgreSqlClient } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import { Unit } from 'EcoPath/Domain/mod.ts';

export class PostgreSqlSensorReadingsByCityAndDateQuery
    implements SensorReadingsByCityAndDateQuery {

    constructor(private readonly db: PostgreSqlClient) {}

    async fetch(
        city: string,
        type: string,
        from: Date,
        to: Date
    ): Promise<SensorReadingsByCityOutput> {
        const { fromIso, toIso } = this.normalizeRange(from, to);

        const rows = await this.db.findMany<{
            timestamp: string;
            value: number;
        }>(`
            SELECT timestamp, value
            FROM sensor_readings
            WHERE smart_meter_id IN
            (SELECT id
            FROM smart_meters
            WHERE city = $1
            AND meter_type = $2)
              AND timestamp >= $3
              AND timestamp < $4
        `, [city, type, fromIso, toIso]);

        const values: SensorReadingRecordData[] = rows.map(r => ({
            timestamp: new Date(r.timestamp),
            value: r.value
        }));

        const unit: Unit = type === 'electricity' ? Unit.KilowattHour : Unit.CubicMeter

        return {
            city,
            type,
            from,
            to,
            unit,
            values
        };
    }

    async fetchAverage(
        city: string,
        type: string,
        from: Date,
        to: Date
    ): Promise<AverageSensorReadingsByCityOutput> {
        const { fromIso, toIso } = this.normalizeRange(from, to);

        const avgRow = await this.db.findOne<{ average: number }>(`
            SELECT AVG(value)::float AS average
            FROM sensor_readings
            WHERE smart_meter_id IN
            (SELECT id
            FROM smart_meters
            WHERE city = $1
            AND meter_type = $2)
              AND timestamp >= $3
              AND timestamp < $4
        `, [city, type, fromIso, toIso]);

        const roundedAverage = Math.round((avgRow.getOrThrow().average ?? 0) * 100) / 100;

        const unit: Unit = type === 'electricity' ? Unit.KilowattHour : Unit.CubicMeter

        return {
            city,
            type,
            from,
            to,
            unit,
            average: roundedAverage
        };
    }

    async fetchGroupedAverage(
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

        const values: SensorReadingRecordData[] = rows.map(r => ({
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