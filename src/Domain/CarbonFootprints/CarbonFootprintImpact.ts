import { ExtraGuard } from "EcoPath/Domain/mod.ts";

export class CarbonFootprintImpact {
    private readonly _co2kg: number;

    private constructor(
        co2kg: number
    ) {
        this._co2kg = co2kg;
    }

    public static create(
        co2kg: number
    ): CarbonFootprintImpact {
        const cfi = new CarbonFootprintImpact(co2kg);
        cfi.validateState();
        return cfi;
    }

    private validateState(): void {
        ExtraGuard.check(this._co2kg, 'co2kg').ensureNumberIsAboveZero();
    }

    get co2kg(): number {
        return this._co2kg;
    }
}