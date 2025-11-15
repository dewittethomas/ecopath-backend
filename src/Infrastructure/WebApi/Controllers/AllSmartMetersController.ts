import type { RouterContext } from '@oak/oak';
import {
    WebApiRequest,
    WebApiResult,
    RequestValidator
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { AllSmartMetersQuery } from 'EcoPath/Application/Contracts/mod.ts';

export class AllSmartMetersController {
    constructor(private readonly query: AllSmartMetersQuery) {}

    async handle(ctx: RouterContext<string>): Promise<void> {
        await WebApiRequest.create(ctx, this.validateRequest);

        const result = await this.query.fetchAll();

        WebApiResult.ok(ctx, result);
    }

    private validateRequest(_ctx: RouterContext<string>): Promise<void> {
        RequestValidator
            .create([])
            .onValidationFailure('Invalid request for smart meters.')
            .validate();

        return Promise.resolve();
    }
}
