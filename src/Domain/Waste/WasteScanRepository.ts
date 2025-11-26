import type { Repository } from '@domaincrafters/domain';
import { WasteScan } from 'EcoPath/Domain/mod.ts';

export interface WasteScanRepository extends Repository<WasteScan> {
    all(): Promise<WasteScan[]>;
}