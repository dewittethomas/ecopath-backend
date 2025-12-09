import type { PgRecord, RecordMapper } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import { SensorReading, Unit, SmartMeterId } from 'EcoPath/Domain/mod.ts';

export class SensorReadingRecordMapper implements RecordMapper<SensorReading> {
    toRecord(entity: SensorReading): PgRecord {
        return {
            smart_meter_id: entity.smartMeterId.toString(),
            timestamp: entity.timestamp.toISOString(),
            value: entity.value,
            unit: entity.unit
        };
    }

    reconstitute(record: PgRecord): SensorReading {
        return SensorReading.create(
            SmartMeterId.create(record.smart_meter_id as string),
            new Date(record.timestamp as string),
            Number(record.value),
            record.unit as Unit
        );
    }
}