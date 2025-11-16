import { Guard } from '@domaincrafters/std';
import { WasteType, WasteCarbonFactors } from 'EcoPath/Domain/mod.ts';

export class CarbonFootprint {
    private readonly _totalGasUsage: number;          // m³
    private readonly _totalElectricityUsage: number;  // kWh
    private readonly _totalWaste: Map<WasteType, number>; // kg per type

    private constructor(
        totalGasUsage: number,
        totalElectricityUsage: number,
        totalWaste: Map<WasteType, number>
    ) {
        this._totalGasUsage = totalGasUsage;
        this._totalElectricityUsage = totalElectricityUsage;
        this._totalWaste = totalWaste;
    }

    public static create(
        totalGasUsage: number,
        totalElectricityUsage: number,
        totalWaste: Map<WasteType, number>
    ): CarbonFootprint {
        const cf = new CarbonFootprint(totalGasUsage, totalElectricityUsage, totalWaste);
        cf.validateState();
        return cf;
    }

    private validateState(): void {
        Guard.check(this._totalGasUsage, 'totalGasUsage')
            .againstNullOrUndefined()
            .againstNegative();

        Guard.check(this._totalElectricityUsage, 'totalElectricityUsage')
            .againstNullOrUndefined()
            .againstNegative();

        for (const [type, weight] of this._totalWaste.entries()) {
            Guard.check(weight, `wasteWeight(${type})`)
                .againstNullOrUndefined()
                .againstNegative();
        }
    }

    /**
     * Calculates CO₂ equivalent in kilograms.
     */
    public calculateCarbonEquivalent(): number {
        const gasFactor = 2.2;          // kg CO₂ per m³ gas
        const electricityFactor = 0.55; // kg CO₂ per kWh

        const gasCO2 = this._totalGasUsage * gasFactor;
        const elecCO2 = this._totalElectricityUsage * electricityFactor;

        let wasteCO2 = 0;

        for (const [type, weight] of this._totalWaste.entries()) {
            const factor = WasteCarbonFactors[type];
            if (factor !== undefined) {
                wasteCO2 += weight * factor;
            }
        }

        return gasCO2 + elecCO2 + wasteCO2;
    }

    get totalGasUsage(): number {
        return this._totalGasUsage;
    }

    get totalElectricityUsage(): number {
        return this._totalElectricityUsage;
    }

    get totalWaste(): Map<WasteType, number> {
        return this._totalWaste;
    }
}