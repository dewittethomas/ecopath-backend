import type { RouterContext } from '@oak/oak';
import type { WebApiController } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import { WebApiResult } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';

import type { ListAllSmartMetersOutput } from 'EcoPath/Application/Contracts/mod.ts';
import { ListAllSmartMeters } from 'EcoPath/Application/mod.ts';

export class AllSmartMetersController implements WebApiController {
    private readonly _useCase: ListAllSmartMeters;

    constructor(useCase: ListAllSmartMeters) {
        this._useCase = useCase;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const output: ListAllSmartMetersOutput = await this._useCase.execute();

        const response = {
            data: output.data,
        };

        WebApiResult.ok(ctx, response);
    }
}