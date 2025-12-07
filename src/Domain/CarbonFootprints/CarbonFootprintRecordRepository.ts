import type { Repository } from '@domaincrafters/domain';
import { CarbonFootprintRecord, UserId } from 'EcoPath/Domain/mod.ts';

export interface CarbonFootprintRecordRepository extends Repository<CarbonFootprintRecord> {
    saveMany(readings: CarbonFootprintRecord[], userId: UserId): Promise<void>;

    allByUserIdAndMonth(
        userId: string,
        month: number,
        year: number
    ): Promise<CarbonFootprintRecord | null>;

    allByUserId(
        userId: string
    ): Promise<CarbonFootprintRecord[]>;
}