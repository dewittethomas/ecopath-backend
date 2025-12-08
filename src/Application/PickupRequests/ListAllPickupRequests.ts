import { PickupRequest } from "EcoPath/Domain/mod.ts";
import type { PickupRequestRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { UseCase } from "@domaincrafters/application";

export interface PickupRequestData {
    id: string;
    location: {
        houseNumber: string;
        street: string;
        city: string;
        postalCode: string;
    };
    timestamp: Date;
    notes?: string;
}

export interface ListAllPickupRequestsOutput {
    data: PickupRequestData[];
}

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

export class ListAllPickupRequests implements UseCase<void, ListAllPickupRequestsOutput> {
    private readonly _repository: PickupRequestRepository;

    constructor(repository: PickupRequestRepository) {
        this._repository = repository;
    }

    async execute(): Promise<ListAllPickupRequestsOutput> {
        const scans = await this._repository.all();
        return { data: scans.map(toPickupRequestData) };
    }
}