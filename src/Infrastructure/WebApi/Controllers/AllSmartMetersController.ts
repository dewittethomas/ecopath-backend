import type { RouterContext } from '@oak/oak';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { AllSmartMetersQuery } from 'EcoPath/Application/Contracts/mod.ts';

export class AllSmartMetersController implements WebApiController {
    constructor(private readonly query: AllSmartMetersQuery) {}

    async handle(ctx: RouterContext<string>): Promise<void> {
        await WebApiRequest.create(ctx, this.validateRequest);

        const result = await this.query.fetch();

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
