import type { Repository } from '@domaincrafters/domain';
import { SmartMeter } from 'EcoPath/Domain/mod.ts';

export interface SmartMeterRepository extends Repository<SmartMeter> {
    all(): Promise<SmartMeter[]>;
}