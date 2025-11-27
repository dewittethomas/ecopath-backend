import type { RouterContext } from '@oak/oak';
import type { WebApiController } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import { WebApiResult } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';

import type { ListAllPickupRequestsOutput } from 'EcoPath/Application/Contracts/mod.ts';
import { ListAllPickupRequests } from 'EcoPath/Application/mod.ts';

export class AllPickupRequestsController implements WebApiController {
    private readonly _useCase: ListAllPickupRequests;

    constructor(useCase: ListAllPickupRequests) {
        this._useCase = useCase;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const output: ListAllPickupRequestsOutput = await this._useCase.execute();

        const response = {
            data: output.data,
        };

        WebApiResult.ok(ctx, response);
    }
}