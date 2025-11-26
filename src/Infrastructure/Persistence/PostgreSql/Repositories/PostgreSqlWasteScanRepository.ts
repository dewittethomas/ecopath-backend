import type { Optional } from '@domaincrafters/std';
import type { WasteScan } from 'EcoPath/Domain/mod.ts';
import type { WasteScanRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { type RecordMapper, type PostgreSqlClient, PostgreSqlRepository } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import type { PgRecord } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';

export class PostgreSqlWasteScanRepository
    extends PostgreSqlRepository<WasteScan>
    implements WasteScanRepository
{
    constructor(
        client: PostgreSqlClient,
        mapper: RecordMapper<WasteScan>,
    ) {
        super(client, 'waste_scans', mapper);
    }

    async findAll(): Promise<WasteScan[]> {
        const rows = await this._dbClient.findMany<PgRecord>(
            `SELECT * FROM ${this._tableName}`,
            []
        );

        return rows.map(row => this._mapper.reconstitute(row));
    }
}
