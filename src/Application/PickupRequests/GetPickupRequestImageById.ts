import { UseCase } from '@domaincrafters/application';
import type { PickupRequestRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { PickupRequest, PickupRequestId } from "EcoPath/Domain/mod.ts";

export interface GetPickupRequestImageByIdOutput {
    image: string
}

export class GetPickupRequestImageById implements UseCase<PickupRequestId, GetPickupRequestImageByIdOutput> {
    private readonly _repository: PickupRequestRepository;

    constructor(repository: PickupRequestRepository) {
        this._repository = repository;
    }

    async execute(pickupRequestId: PickupRequestId): Promise<GetPickupRequestImageByIdOutput> {
        const pickupRequest: PickupRequest = (await (this._repository.byId(pickupRequestId))).getOrThrow();
        return { image: pickupRequest.image };
    }
}