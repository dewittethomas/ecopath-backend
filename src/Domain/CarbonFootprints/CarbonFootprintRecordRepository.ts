import type { Repository } from '@domaincrafters/domain';
import { CarbonFootprintRecord } from 'EcoPath/Domain/mod.ts';

export interface CarbonFootprintRecordRepository extends Repository<CarbonFootprintRecord> {
    allByUserIdAndMonth(
        userId: string,
        month: number,
        year: number
    ): Promise<CarbonFootprintRecord | null>;

    allByUserId(
        userId: string
    ): Promise<CarbonFootprintRecord[]>;
}