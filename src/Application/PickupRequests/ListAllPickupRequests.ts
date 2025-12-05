import { PickupRequest } from "EcoPath/Domain/mod.ts";
import type {
    PickupRequestRepository, PickupRequestData
} from 'EcoPath/Application/Contracts/mod.ts';

function toPickupRequestData(entity: PickupRequest): PickupRequestData {
    return {
        id: entity.id.toString(),
        location: {
            houseNumber: entity.location.houseNumber,
            street: entity.location.street,
            city: entity.location.city,
            postalCode: entity.location.postalCode
        },
        timestamp: entity.timestamp,
        notes: entity.notes
    };
}

export interface ListAllPickupRequestsOutput {
    data: PickupRequestData[];
}

export class ListAllPickupRequests {
    private readonly _repository: PickupRequestRepository;

    constructor(repository: PickupRequestRepository) {
        this._repository = repository;
    }

    async execute(): Promise<ListAllPickupRequestsOutput> {
        const scans = await this._repository.all();
        return { data: scans.map(toPickupRequestData) };
    }
}