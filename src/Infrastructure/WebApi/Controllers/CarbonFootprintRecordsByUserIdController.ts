import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { CarbonFootprintRecordsByUserIdQuery } from 'EcoPath/Application/Contracts/mod.ts';

export class CarbonFootprintRecordsByUserIdController implements WebApiController {
    constructor(
        private readonly query: CarbonFootprintRecordsByUserIdQuery
    ) {}

    async handle(ctx: RouterContext<string>): Promise<void> {
        await WebApiRequest.create(ctx, this.validateRequest);

        const userId = ctx.params.userId!;

        const monthParam = ctx.request.url.searchParams.get('month');
        const yearParam = ctx.request.url.searchParams.get('year');

        let result;

        if (monthParam) {
            // fetch by month/year
            const year = yearParam ? Number(yearParam) : new Date().getFullYear();
            result = await this.query.fetchByDate(userId, Number(monthParam), Number(year));
        } else {
            // fetch all
            result = await this.query.fetch(userId);
        }

        WebApiResult.ok(ctx, result);
    }

    private validateRequest(ctx: RouterContext<string>): Promise<void> {
        RequestValidator
            .create([
                () => Guard.check(ctx.params.userId).againstEmpty('userId is required'),
            ])
            .onValidationFailure('Invalid request for carbon footprint records.')
            .validate();

        return Promise.resolve();
    }
}