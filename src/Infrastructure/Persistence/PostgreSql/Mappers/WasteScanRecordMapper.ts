import type { PgRecord, RecordMapper } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';
import { WasteScan, WasteScanId, WasteType, GeoLocation } from 'EcoPath/Domain/mod.ts';

export class WasteScanRecordMapper implements RecordMapper<WasteScan> {
    toRecord(entity: WasteScan): PgRecord {
        return {
            image: entity.image,
            timestamp: entity.timestamp.toISOString(),
            wasteType: entity.wasteType,
            geoLocation: entity.geoLocation
        };
    }

    reconstitute(record: PgRecord): WasteScan {
        return WasteScan.create(
            WasteScanId.create(record.id as string),
            record.image as string,
            new Date(record.timestamp as string),
            record.wasteType as WasteType,
            record.geoLocation as GeoLocation
        );
    }
}