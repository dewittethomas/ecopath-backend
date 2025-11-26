import type { WasteScan } from 'EcoPath/Domain/mod.ts';
import type { WasteScanRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { type RecordMapper, type PostgreSqlClient, PostgreSqlRepository } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';

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
}
