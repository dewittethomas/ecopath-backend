import { MeterType, SmartMeter } from "EcoPath/Domain/mod.ts";
import type { SmartMeterRepository } from 'EcoPath/Application/Contracts/mod.ts';

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

function toSmartMeterData(entity: SmartMeter): SmartMeterData {
    return {
        id: entity.id.toString(),
        meterType: entity.meterType as MeterType,
        location: {
            houseNumber: entity.location.houseNumber as string,
            street: entity.location.street as string,
            city: entity.location.street as string,
            postalCode: entity.location.postalCode as string
        }
    };
}

export interface ListAllSmartMetersOutput {
    data: SmartMeterData[];
}

export class ListAllSmartMeters {
    private readonly _repository: SmartMeterRepository;

    constructor(repository: SmartMeterRepository) {
        this._repository = repository;
    }

    async execute(): Promise<ListAllSmartMetersOutput> {
        const scans = await this._repository.all();
        return { data: scans.map(toSmartMeterData) };
    }
}