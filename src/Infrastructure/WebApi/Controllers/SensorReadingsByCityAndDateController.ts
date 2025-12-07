import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { SensorReadingsByCityAndDateQuery } from 'EcoPath/Application/Contracts/mod.ts';

export class SensorReadingsByCityAndDateController implements WebApiController {
    constructor(
        private readonly query: SensorReadingsByCityAndDateQuery
    ) {}

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request = await WebApiRequest.create(ctx, this.validateRequest);

        const city = request.parameter('city');
        const type = request.parameter('type');

        const fromParam = ctx.request.url.searchParams.get('from');
        const toParam = ctx.request.url.searchParams.get('to');

        const from = new Date(fromParam as string);
        const to = new Date(toParam as string);

        const avgFlag = ctx.request.url.searchParams.get('avg');
        const interval = ctx.request.url.searchParams.get('interval') as 'day' | 'week' | 'month' | null;

        let result;
        
        if (avgFlag === 'true' && interval) {
            // grouped averages (day/week/month)
            result = await this.query.fetchGroupedAverage(city, type, from, to, interval);
        } else if (avgFlag === 'true') {
            // single average
            result = await this.query.fetchAverage(city, type, from, to);
        } else {
            // raw readings
            result = await this.query.fetch(city, type, from, to);
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