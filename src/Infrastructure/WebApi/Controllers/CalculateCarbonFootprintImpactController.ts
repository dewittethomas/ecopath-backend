import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { UseCase } from '@domaincrafters/application';
import type { CalculateCarbonFootprintImpactInput, CalculateCarbonFootprintImpactOutput } from 'EcoPath/Application/Contracts/mod.ts';
import { SaveCarbonFootprintRecordInput } from "../../../Application/CarbonFootprints/SaveCarbonFootprintRecord.ts";

export interface CalculateCarbonFootprintImpactBody {
    userId: string;
    year: number;
    month: number;
    carbonFootprintData: {
        gasM3: number;
        electricityKWh: number;
        wasteKg: Map<string, number> 
    }
}

export class CalculateCarbonFootprintImpactController implements WebApiController {
    private readonly _calculateCarbonFootprintImpact: UseCase<CalculateCarbonFootprintImpactInput, CalculateCarbonFootprintImpactOutput>;
    private readonly _saveCarbonFootprintImpact: UseCase<SaveCarbonFootprintRecordInput>;

    constructor(
        calculateCarbonFootprintImpact: UseCase<CalculateCarbonFootprintImpactInput, CalculateCarbonFootprintImpactOutput>,
        saveCarbonFootprintRecord: UseCase<SaveCarbonFootprintRecordInput>
    ) {
        this._calculateCarbonFootprintImpact = calculateCarbonFootprintImpact;
        this._saveCarbonFootprintImpact = saveCarbonFootprintRecord;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request: WebApiRequest = await WebApiRequest.create(ctx, this.validateRequest);
        const body: CalculateCarbonFootprintImpactBody = await request.body<CalculateCarbonFootprintImpactBody>();

        const calculationInput: CalculateCarbonFootprintImpactInput = {
            gasM3: body.carbonFootprintData.gasM3,
            electricityKWh: body.carbonFootprintData.electricityKWh,
            wasteKg: body.carbonFootprintData.wasteKg
        }

        const result = await this._calculateCarbonFootprintImpact.execute(calculationInput);

        const saveInput: SaveCarbonFootprintRecordInput = {
            userId: body.userId,
            month: body.month,
            year: body.year,
            carbonFootprintData: {
                gasM3: body.carbonFootprintData.gasM3,
                electricityKWh: body.carbonFootprintData.electricityKWh,
                wasteKg: body.carbonFootprintData.wasteKg
            }
        }

        await this._saveCarbonFootprintImpact.execute(saveInput);

        WebApiResult.ok(ctx, result);
    }

    private async validateRequest(ctx: RouterContext<string>): Promise<void> {
        const body: CalculateCarbonFootprintImpactBody = await ctx.request.body.json() as CalculateCarbonFootprintImpactBody;

        RequestValidator
            .create([
                () => Guard.check(body.userId).againstNullOrUndefined('UserId is required'),
                () => Guard.check(body.month).isInRange(1, 12, 'Month is required and should be between 1 and 12'),
                () => Guard.check(body.year).isInRange(2000, 2100, 'Year is required and should be between 2000 and 2100'),
                () => Guard.check(body.carbonFootprintData).againstNullOrUndefined('CarbonFootprintData is required'),
                () => Guard.check(body.carbonFootprintData.gasM3).againstZero().againstNegative('Gas (M3) should be positive'),
                () => Guard.check(body.carbonFootprintData.electricityKWh).againstZero().againstNegative('Electricity (KWh) should be positive'),
                () => Guard.check(body.carbonFootprintData.wasteKg).againstNullOrUndefined("Waste (kg) is required")
            ])
            .onValidationFailure('Invalid request for pickup requests.')
            .validate();
    }
}