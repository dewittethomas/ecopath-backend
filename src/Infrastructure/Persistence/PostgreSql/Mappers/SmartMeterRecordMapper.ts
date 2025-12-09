import type { PgRecord, RecordMapper } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import { SmartMeter, SmartMeterId, MeterType, Location } from 'EcoPath/Domain/mod.ts';

export class SmartMeterRecordMapper implements RecordMapper<SmartMeter> {
    toRecord(entity: SmartMeter): PgRecord {
        return {
            id: entity.id.toString(),
            meter_type: entity.meterType,

            house_number: entity.location.houseNumber,
            street: entity.location.street,
            city: entity.location.city,
            postal_code: entity.location.postalCode
        };
    }

    reconstitute(record: PgRecord): SmartMeter {
        const location = Location.create(
            record.house_number as string,
            record.street as string,
            record.city as string,
            record.postal_code as string
        );

        return SmartMeter.create(
            SmartMeterId.create(record.id as string),
            record.meter_type as MeterType,
            location
        );
    }
}