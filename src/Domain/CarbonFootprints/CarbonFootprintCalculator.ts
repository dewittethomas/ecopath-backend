import { CarbonFootprintData, WasteCarbonFactors, CarbonFootprintImpact } from "EcoPath/Domain/mod.ts";

export class CarbonFootprintCalculator {
    static calculate(data: CarbonFootprintData): CarbonFootprintImpact {
        const gasFactor = 2.2;
        const electricityFactor = 0.55;

        const gas = data.gasM3 * gasFactor;
        const elec = data.electricityKWh * electricityFactor;

        let waste = 0;
        for (const [type, kg] of data.wasteKg.entries()) {
            waste += kg * WasteCarbonFactors[type];
        }

        return CarbonFootprintImpact.create(gas + elec + waste);
    }
}