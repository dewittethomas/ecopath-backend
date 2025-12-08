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

export interface CalculateCarbonFootprintImpactBody {
    gasM3: number;
    electricityKWh: number;
    wasteKg: Map<string, number> 
}

export class CalculateCarbonFootprintImpactController implements WebApiController {
    private readonly _calculateCarbonFootprintImpact: UseCase<CalculateCarbonFootprintImpactInput, CalculateCarbonFootprintImpactOutput>;

    constructor(calculateCarbonFootprintImpact: UseCase<CalculateCarbonFootprintImpactInput, CalculateCarbonFootprintImpactOutput>) {
        this._calculateCarbonFootprintImpact = calculateCarbonFootprintImpact;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request: WebApiRequest = await WebApiRequest.create(ctx, this.validateRequest);
        const body: CalculateCarbonFootprintImpactBody = await request.body<CalculateCarbonFootprintImpactBody>();

        const input: CalculateCarbonFootprintImpactInput = {
            gasM3: body.gasM3,
            electricityKWh: body.electricityKWh,
            wasteKg: body.wasteKg
        }

        const result = await this._calculateCarbonFootprintImpact.execute(input);

        WebApiResult.ok(ctx, result);
    }

    private validateRequest(ctx: RouterContext<string>): Promise<void> {
        RequestValidator
            .create([
                
            ])
            .onValidationFailure('Invalid request for pickup requests.')
            .validate();

        return Promise.resolve();
    }
}