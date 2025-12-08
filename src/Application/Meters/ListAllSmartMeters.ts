import { SmartMeter } from "EcoPath/Domain/mod.ts";
import type { SmartMeterRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { UseCase } from "@domaincrafters/application";

export interface SmartMeterData {
    id: string;
    meterType: string;
    location: {
        houseNumber: string;
        street: string;
        city: string;
        postalCode: string;
    };
}

export interface ListAllSmartMetersOutput {
    data: SmartMeterData[];
}

function toSmartMeterData(entity: SmartMeter): SmartMeterData {
    return {
        id: entity.id.toString(),
        meterType: entity.meterType,
        location: {
            houseNumber: entity.location.houseNumber,
            street: entity.location.street,
            city: entity.location.street,
            postalCode: entity.location.postalCode
        }
    };
}

export class ListAllSmartMeters implements UseCase<void, ListAllSmartMetersOutput> {
    private readonly _repository: SmartMeterRepository;

    constructor(repository: SmartMeterRepository) {
        this._repository = repository;
    }

    async execute(): Promise<ListAllSmartMetersOutput> {
        const scans = await this._repository.all();
        return { data: scans.map(toSmartMeterData) };
    }
}