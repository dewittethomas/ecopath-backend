import { SensorReading, SmartMeterId } from 'EcoPath/Domain/mod.ts';
import type { SensorReadingRepository } from 'EcoPath/Application/Contracts/mod.ts';
import type { RecordMapper, PostgreSqlClient } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';

export class PostgreSqlSensorReadingRepository implements SensorReadingRepository {
    private readonly _dbClient: PostgreSqlClient;
    private readonly _mapper: RecordMapper<SensorReading>;
    private readonly _tableName = 'sensor_readings';

    constructor(dbClient: PostgreSqlClient, mapper: RecordMapper<SensorReading>) {
        this._dbClient = dbClient;
        this._mapper = mapper;
    }

    async save(valueObject: SensorReading, smartMeterId: SmartMeterId): Promise<void> {
        const record = this._mapper.toRecord(valueObject);

        const query = `
            INSERT INTO ${this._tableName} (smart_meter_id, timestamp, value, unit)
            VALUES ($1, $2, $3, $4)
        `;

        await this._dbClient.insert(query, [
            smartMeterId.toString(),
            record.timestamp,
            record.value,
            record.unit
        ]);
    }

    async saveMany(entities: SensorReading[], smartMeterId: SmartMeterId): Promise<void> {
        if (entities.length === 0) return;

        const records = entities.map(r => this._mapper.toRecord(r));

        const placeholders: string[] = [];
        const params: unknown[] = [];

        let index = 0;

        for (const record of records) {
            const base = index * 4;

            placeholders.push(
                `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`
            )

            params.push(
                smartMeterId.toString(),
                record.timestamp,
                record.value,
                record.unit
            );

            index++;
        }

        const query = `
            INSERT INTO ${this._tableName} (smart_meter_id, timestamp, value, unit) 
            VALUES ${placeholders.join(', ')}
        `;

        await this._dbClient.execute(query, params);
    }
}