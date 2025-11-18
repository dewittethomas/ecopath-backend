import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    WebApiRequest,
    WebApiResult,
    RequestValidator
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { CarbonFootprintRecordsByUserIdQuery } from 'EcoPath/Application/Contracts/mod.ts';

export class CarbonFootprintRecordsByUserIdController {
    constructor(
        private readonly query: CarbonFootprintRecordsByUserIdQuery
    ) {}

    async handle(ctx: RouterContext<string>): Promise<void> {
        await WebApiRequest.create(ctx, this.validateRequest);

        const userId = ctx.params.userId!;

        const monthParam = ctx.request.url.searchParams.get('month');
        const yearParam = ctx.request.url.searchParams.get('year');

        let result;

        if (monthParam && yearParam) {
            // fetch by month/year
            result = await this.query.fetchByMonth(userId, Number(monthParam), Number(yearParam));
        } else {
            // fetch all
            result = await this.query.fetchAll(userId);
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