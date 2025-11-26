import type { RouterContext } from '@oak/oak';
import type { WebApiController } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import { WebApiResult } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';

import type { ListAllWasteScansOutput } from 'EcoPath/Application/Contracts/mod.ts';
import { ListAllWasteScans } from 'EcoPath/Application/mod.ts';

export class AllWasteScansController implements WebApiController {
    private readonly _useCase: ListAllWasteScans;

    constructor(useCase: ListAllWasteScans) {
        this._useCase = useCase;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const output: ListAllWasteScansOutput = await this._useCase.execute();

        const response = {
            data: output.data,
        };

        WebApiResult.ok(ctx, response);
    }
}