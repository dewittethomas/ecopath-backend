import { WasteScan } from "EcoPath/Domain/mod.ts";
import type { WasteScanRepository } from 'EcoPath/Application/Contracts/mod.ts';

export interface WasteScanData {
    id: string;
    timestamp: Date;
    wasteType: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    };
}

function toWasteScanData(entity: WasteScan): WasteScanData {
    return {
        id: entity.id.toString(),
        timestamp: entity.timestamp,
        wasteType: entity.wasteType,
        geoLocation: {
            latitude: entity.geoLocation.latitude,
            longitude: entity.geoLocation.longitude
        }
    };
}

export interface ListAllWasteScansOutput {
    data: WasteScanData[];
}

export class ListAllWasteScans {
    private readonly _repository: WasteScanRepository;

    constructor(repository: WasteScanRepository) {
        this._repository = repository;
    }

    async execute(): Promise<ListAllWasteScansOutput> {
        const scans = await this._repository.all();
        return { data: scans.map(toWasteScanData) };
    }
}