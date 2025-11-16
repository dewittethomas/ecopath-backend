import type { Repository } from '@domaincrafters/domain';
import { WasteRecord } from 'EcoPath/Domain/mod.ts';

export interface WasteRecordRepository extends Repository<WasteRecord> {
    findByUserAndMonth(userId: string, month: number, year: number): Promise<WasteRecord[]>
}