import type { SmartMeter } from 'EcoPath/Domain/mod.ts';
import type { SmartMeterRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { type RecordMapper, type PostgreSqlClient, PostgreSqlRepository } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import type { PgRecord } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';

export class PostgreSqlSmartMeterRepository
    extends PostgreSqlRepository<SmartMeter>
    implements SmartMeterRepository
{
    constructor(
        client: PostgreSqlClient,
        mapper: RecordMapper<SmartMeter>,
    ) {
        super(client, 'smart_meters', mapper);
    }

    async findAll(): Promise<SmartMeter[]> {
        const rows = await this._dbClient.findMany<PgRecord>(
            `SELECT * FROM ${this._tableName}`,
            []
        );

        return rows.map(row => this._mapper.reconstitute(row));
    }
}