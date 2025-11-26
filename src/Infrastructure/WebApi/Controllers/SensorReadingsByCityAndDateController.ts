import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { SensorReadingsBySmartMeterIdAndDateQuery } from 'EcoPath/Application/Contracts/mod.ts';

export class SensorReadingsByCityAndDateController implements WebApiController {
    constructor(
        private readonly query: SensorReadingsBySmartMeterIdAndDateQuery
    ) {}

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request = await WebApiRequest.create(ctx, this.validateRequest);

        const city = request.parameter('city');
        const type = request.parameter('type');

        const fromParam = ctx.request.url.searchParams.get('from');
        const toParam = ctx.request.url.searchParams.get('to');

        const from = new Date(fromParam as string);
        const to = new Date(toParam as string);

        const interval = ctx.request.url.searchParams.get('interval') as 'day' | 'week' | 'month' | null;

        let result;
        
        if (interval) {
            result = await this.query.fetchGroupedAverageByCity(city, type, from, to, interval);
        }

        WebApiResult.ok(ctx, result);
    }

    private validateRequest(ctx: RouterContext<string>): Promise<void> {
        RequestValidator
            .create([
                () => Guard.check(ctx.params.city).againstEmpty('city is required'),
                () => Guard.check(ctx.params.type).againstEmpty('type is required'),
                () => Guard.check(ctx.request.url.searchParams.get('from')).againstEmpty('"from" query is required'),
                () => Guard.check(ctx.request.url.searchParams.get('to')).againstEmpty('"to" query is required')
            ])
            .onValidationFailure('Invalid request for sensor readings.')
            .validate();

        return Promise.resolve();
    }
}