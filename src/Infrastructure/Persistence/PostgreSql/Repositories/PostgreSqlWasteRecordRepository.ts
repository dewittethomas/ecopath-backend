import type { WasteRecord } from 'EcoPath/Domain/mod.ts';
import type { WasteRecordRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { type RecordMapper, type PostgreSqlClient, PostgreSqlRepository } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';

export class PostgreSqlWasteRecordRepository 
    extends PostgreSqlRepository<WasteRecord>
    implements WasteRecordRepository
{
    constructor(
        client: PostgreSqlClient,
        mapper: RecordMapper<WasteRecord>,
    ) {
        super(client, 'waste_records', mapper);
    }
}