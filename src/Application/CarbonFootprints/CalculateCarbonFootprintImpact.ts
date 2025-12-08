import type { UseCase } from '@domaincrafters/application';
import {
    CarbonFootprintData,
    CarbonFootprintCalculator,
    WasteType
} from 'EcoPath/Domain/mod.ts';

export interface CalculateCarbonFootprintImpactInput {
    gasM3: number;
    electricityKWh: number;
    wasteKg: Map<string, number>
}

export interface CalculateCarbonFootprintImpactOutput {
    carbonFootprintImpact: number;
}

export class CalculateCarbonFootprintImpact implements UseCase<CalculateCarbonFootprintImpactInput, CalculateCarbonFootprintImpactOutput> {
    constructor() {}

    execute(input: CalculateCarbonFootprintImpactInput): Promise<CalculateCarbonFootprintImpactOutput> {
        const wasteMap = new Map<WasteType, number>();

        for (const [key, value] of Object.entries(input.wasteKg)) {
            const enumValue = Object.values(WasteType).find(v => v === key);
            if (!enumValue) {
                throw new Error(`Invalid WasteType: ${key}`);
            }
            wasteMap.set(enumValue as WasteType, value);
        }

        const cfd = CarbonFootprintData.create(
            input.gasM3,
            input.electricityKWh,
            wasteMap
        );

        const impact = CarbonFootprintCalculator.calculate(cfd);

        return Promise.resolve({
            carbonFootprintImpact: impact.co2kg
        });
    }
}