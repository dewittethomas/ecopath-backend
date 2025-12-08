import type { PgRecord, RecordMapper } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';
import {
    CarbonFootprintRecord,
    CarbonFootprintRecordId,
    CarbonFootprintData,
    UserId
} from 'EcoPath/Domain/mod.ts';

export class CarbonFootprintRecordMapper implements RecordMapper<CarbonFootprintRecord> {
    toRecord(entity: CarbonFootprintRecord): PgRecord {
        return {
            id: entity.id.toString(),
            user_id: entity.userId.toString(),
            month: entity.month,
            year: entity.year,
            total_gas_usage: entity.carbonFootprintData.gasM3,
            total_electricity_usage: entity.carbonFootprintData.electricityKWh
        };
    }

    reconstitute(record: PgRecord): CarbonFootprintRecord {
        const cf = CarbonFootprintData.create(
            Number(record.total_gas_usage),
            Number(record.total_electricity_usage),
            new Map()
        );

        return CarbonFootprintRecord.create(
            CarbonFootprintRecordId.create(record.id as string),
            UserId.create(record.user_id as string),
            Number(record.month),
            Number(record.year),
            cf
        );
    }
}