import type { Repository } from '@domaincrafters/domain';
import { WasteRecord } from 'EcoPath/Domain/mod.ts';

export interface WasteRecordRepository extends Repository<WasteRecord> {
}