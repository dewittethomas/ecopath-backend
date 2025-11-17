import type { RouterContext } from '@oak/oak';

import {
    WebApiRequest,
    WebApiResult,
    RequestValidator
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';

import { Guard } from '@domaincrafters/std';

import type { AllCarbonFootprintRecordsByUserIdQuery }
    from 'EcoPath/Application/Contracts/mod.ts';


export class AllCarbonFootprintRecordsByUserIdController {

    constructor(
        private readonly query: AllCarbonFootprintRecordsByUserIdQuery
    ) {}

    async handle(ctx: RouterContext<string>): Promise<void> {
        // Validate & parse request
        await WebApiRequest.create(ctx, this.validateRequest);

        const userId = ctx.params.userId!;

        // Execute query
        const result = await this.query.fetchAll(userId);

        WebApiResult.ok(ctx, result);
    }

    private validateRequest(ctx: RouterContext<string>): Promise<void> {
        RequestValidator
            .create([
                () =>
                    Guard
                        .check(ctx.params.userId)
                        .againstEmpty('userId is required'),
            ])
            .onValidationFailure('Invalid request for carbon footprint records.')
            .validate();

        return Promise.resolve();
    }
}
