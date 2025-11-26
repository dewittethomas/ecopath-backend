import type { UseCase } from '@domaincrafters/application';
import type { WasteScanRepository, UnitOfWork } from "EcoPath/Application/Contracts/mod.ts";
import { WasteScan, WasteScanId, WasteType, GeoLocation } from "EcoPath/Domain/mod.ts";

export interface SaveWasteScanInput {
    id: string;
    image: string;
    timestamp: Date;
    wasteType: WasteType;
    geoLocation: GeoLocation;
}

export class SaveWasteScan implements UseCase<SaveWasteScanInput> {
    private readonly _wasteScanRepository: WasteScanRepository;
    private readonly _unitOfWork: UnitOfWork;

    constructor(
        wasteScanRepository: WasteScanRepository,
        unitOfWork: UnitOfWork,
    ) {
        this._wasteScanRepository = wasteScanRepository;
        this._unitOfWork = unitOfWork;
    }

    execute(input: SaveWasteScanInput): Promise<void> {
        return this._unitOfWork.do<void>(() => {
            const wasteScan = WasteScan.create(
                WasteScanId.create(input.id),
                input.image,
                input.timestamp,
                input.wasteType,
                input.geoLocation
            );

            return this._wasteScanRepository.save(wasteScan);
        });
    }
}
