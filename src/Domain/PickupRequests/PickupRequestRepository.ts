import type { Repository } from '@domaincrafters/domain';
import { PickupRequest } from 'EcoPath/Domain/mod.ts';

export interface PickupRequestRepository extends Repository<PickupRequest> {
    all(): Promise<PickupRequest[]>;
}