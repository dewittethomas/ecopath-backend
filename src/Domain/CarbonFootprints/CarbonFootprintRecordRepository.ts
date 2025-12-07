import type { Repository } from '@domaincrafters/domain';
import { CarbonFootprintRecord } from 'EcoPath/Domain/mod.ts';

export interface CarbonFootprintRecordRepository extends Repository<CarbonFootprintRecord> {
    allByUserId(
        userId: string
    ): Promise<CarbonFootprintRecord[]>;

    allByUserIdAndMonth(
        userId: string,
        month: number,
        year: number
    ): Promise<CarbonFootprintRecord | null>;
}