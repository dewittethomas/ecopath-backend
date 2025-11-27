import type { UseCase } from '@domaincrafters/application';
import type { PickupRequestRepository, UnitOfWork } from "EcoPath/Application/Contracts/mod.ts";
import { PickupRequest, PickupRequestId, Location } from "EcoPath/Domain/mod.ts";

export interface SavePickupRequestInput {
    location: {
        houseNumber: string;
        street: string;
        city: string;
        postalCode: string;
    }
    image: string;
    timestamp: Date;
    notes?: string;
}

export class SaveWasteScan implements UseCase<SavePickupRequestInput, string> {
    private readonly _pickupRequestRepository: PickupRequestRepository;
    private readonly _unitOfWork: UnitOfWork;

    constructor(
        pickupRequestRepository: PickupRequestRepository,
        unitOfWork: UnitOfWork,
    ) {
        this._pickupRequestRepository = pickupRequestRepository;
        this._unitOfWork = unitOfWork;
    }

    async execute(input: SavePickupRequestInput): Promise<string> {
        return this._unitOfWork.do<string>(async () => {
            const location = Location.create(
                input.location.houseNumber,
                input.location.street,
                input.location.city,
                input.location.postalCode,
            );

            const pickupRequestId = PickupRequestId.create();

            const pickupRequest = PickupRequest.create(
                pickupRequestId,
                location,
                input.image,
                input.timestamp,
                input.notes?
            );

            await this._pickupRequestRepository.save(pickupRequest);

            return pickupRequest.id.toString();
        });
    }
}
