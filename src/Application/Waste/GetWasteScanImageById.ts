import { UseCase } from '@domaincrafters/application';
import type {
    WasteScanRepository
} from 'EcoPath/Application/Contracts/mod.ts';
import { WasteScan, WasteScanId } from "EcoPath/Domain/mod.ts";

export interface GetWasteScanImageByIdOutput {
    image: string
}

export interface GetWasteScanImageByIdOutput {
    image: string;
}

export class GetWasteScanImageById implements UseCase<WasteScanId, GetWasteScanImageByIdOutput> {
    private readonly _repository: WasteScanRepository;

    constructor(repository: WasteScanRepository) {
        this._repository = repository;
    }

    async execute(wasteScanId: WasteScanId): Promise<GetWasteScanImageByIdOutput> {
        const wasteScan: WasteScan = (await (this._repository.byId(wasteScanId))).getOrThrow();
        return { image: wasteScan.image };
    }
}