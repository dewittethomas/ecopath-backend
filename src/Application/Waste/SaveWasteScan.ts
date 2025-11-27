import type { UseCase } from '@domaincrafters/application';
import type { WasteScanRepository, UnitOfWork } from "EcoPath/Application/Contracts/mod.ts";
import { WasteScan, WasteScanId, WasteType, GeoLocation } from "EcoPath/Domain/mod.ts";

export interface SaveWasteScanInput {
    image: string;
    timestamp: Date;
    wasteType: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    }
}

export class SaveWasteScan implements UseCase<SaveWasteScanInput, string> {
    private readonly _wasteScanRepository: WasteScanRepository;
    private readonly _unitOfWork: UnitOfWork;

    constructor(
        wasteScanRepository: WasteScanRepository,
        unitOfWork: UnitOfWork,
    ) {
        this._wasteScanRepository = wasteScanRepository;
        this._unitOfWork = unitOfWork;
    }

    async execute(input: SaveWasteScanInput): Promise<string> {
        return this._unitOfWork.do<string>(async () => {
            const geoLocation: GeoLocation = GeoLocation.create(
                input.geoLocation.latitude,
                input.geoLocation.longitude
            );

            const wasteScanId = WasteScanId.create();

            const wasteScan = WasteScan.create(
                wasteScanId,
                input.image,
                input.timestamp,
                input.wasteType as WasteType,
                geoLocation
            );

            await this._wasteScanRepository.save(wasteScan);

            return wasteScan.id.toString();
        });
    }
}
