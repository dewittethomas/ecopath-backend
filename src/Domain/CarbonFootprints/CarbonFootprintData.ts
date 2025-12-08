import { Guard } from '@domaincrafters/std';
import { WasteType } from 'EcoPath/Domain/mod.ts';

export class CarbonFootprintData {
    private readonly _gasM3: number;          // m³
    private readonly _electricityKWh: number;  // kWh
    private readonly _wasteKg: Map<WasteType, number>; // kg per type

    private constructor(
        gas: number,
        electricity: number,
        waste: Map<WasteType, number>
    ) {
        this._gasM3 = gas;
        this._electricityKWh = electricity;
        this._wasteKg = waste;
    }

    public static create(
        gasM3: number,
        electricityKWh: number,
        wasteKg: Map<WasteType, number>
    ): CarbonFootprintData {
        const cf = new CarbonFootprintData(gasM3, electricityKWh, wasteKg);
        cf.validateState();
        return cf;
    }

    private validateState(): void {
        Guard.check(this._gasM3, 'gasM3').againstNegative();
        Guard.check(this._electricityKWh, 'electricityKWh').againstNegative();

        for (const [type, weight] of this._wasteKg.entries()) {
            Guard.check(weight, `wasteWeight(${type})`).againstNegative();
        }
    }

    get gasM3(): number {
        return this._gasM3;
    }

    get electricityKWh(): number {
        return this._electricityKWh;
    }

    get wasteKg(): Map<WasteType, number> {
        return this._wasteKg;
    }
}