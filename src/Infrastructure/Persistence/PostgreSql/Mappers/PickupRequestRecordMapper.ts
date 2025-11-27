import type { PgRecord, RecordMapper } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';
import { PickupRequest, PickupRequestId, Location } from 'EcoPath/Domain/mod.ts';

export class PickupRequestMapper implements RecordMapper<PickupRequest> {
    toRecord(entity: PickupRequest): PgRecord {
        return {
            id: entity.id.toString(),
            house_number: entity.location.houseNumber,
            street: entity.location.street,
            city: entity.location.city,
            postal_code: entity.location.postalCode,
            image: entity.image,
            timestamp: entity.timestamp.toISOString(),
            notes: entity.notes
        };
    }

    reconstitute(record: PgRecord): PickupRequest {
        const location = Location.create(
            record.house_number as string,
            record.street as string,
            record.city as string,
            record.postal_code as string
        );

        return PickupRequest.create(
            PickupRequestId.create(record.id as string),
            location,
            record.image as string,
            new Date(record.timestamp as string),
            record.notes as string
        )
    }
}