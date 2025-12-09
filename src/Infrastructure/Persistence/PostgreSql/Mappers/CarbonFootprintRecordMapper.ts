import type { PgRecord, RecordMapper } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';
import {
    CarbonFootprintRecord,
    CarbonFootprintRecordId,
    CarbonFootprintData,
    CarbonFootprintImpact,
    UserId
} from 'EcoPath/Domain/mod.ts';

export class CarbonFootprintRecordMapper implements RecordMapper<CarbonFootprintRecord> {
    toRecord(entity: CarbonFootprintRecord): PgRecord {
        return {
            id: entity.id.toString(),
            user_id: entity.userId.toString(),
            month: entity.month,
            year: entity.year,
            gas_m3: entity.carbonFootprintData.gasM3,
            electricity_kwh: entity.carbonFootprintData.electricityKWh,
            impact_co2kg: entity.impact.co2kg
        };
    }

    reconstitute(record: PgRecord): CarbonFootprintRecord {
        const cf = CarbonFootprintData.create(
            Number(record.gas_m3),
            Number(record.electricity_kwh),
            new Map()
        );

        const impact = CarbonFootprintImpact.create(record.impact_co2kg as number);

        return CarbonFootprintRecord.create(
            CarbonFootprintRecordId.create(record.id as string),
            UserId.create(record.user_id as string),
            Number(record.month),
            Number(record.year),
            cf,
            impact
        );
    }
}