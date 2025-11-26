import type { PgRecord, RecordMapper } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';
import { WasteScan, WasteScanId, WasteType, GeoLocation } from 'EcoPath/Domain/mod.ts';

export class WasteScanRecordMapper implements RecordMapper<WasteScan> {
    toRecord(entity: WasteScan): PgRecord {
        return {
            id: entity.id.toString(),
            image: entity.image,
            timestamp: entity.timestamp.toISOString(),
            waste_type: entity.wasteType,
            latitude: entity.geoLocation.latitude,
            longitude: entity.geoLocation.longitude
        };
    }

    reconstitute(record: PgRecord): WasteScan {
        const geoLocation = GeoLocation.create(record.latitude as number, record.longitude as number);

        return WasteScan.create(
            WasteScanId.create(record.id as string),
            record.image as string,
            new Date(record.timestamp as string),
            record.waste_type as WasteType,
            geoLocation
        );
    }
}