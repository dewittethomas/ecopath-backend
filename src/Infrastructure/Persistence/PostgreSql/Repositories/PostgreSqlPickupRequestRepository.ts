import type { PickupRequest } from 'EcoPath/Domain/mod.ts';
import type { PickupRequestRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { type RecordMapper, type PostgreSqlClient, PostgreSqlRepository } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';

export class PostgreSqlPickupRequestRepository
    extends PostgreSqlRepository<PickupRequest>
    implements PickupRequestRepository
{
    constructor(
        client: PostgreSqlClient,
        mapper: RecordMapper<PickupRequest>,
    ) {
        super(client, 'pickup_requests', mapper);
    }
}
