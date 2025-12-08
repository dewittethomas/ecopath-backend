import type { RouterContext } from '@oak/oak';
import type { WebApiController } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import { WebApiResult } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';

import type { ListAllUsersOutput } from 'EcoPath/Application/Contracts/mod.ts';
import { ListAllUsers } from 'EcoPath/Application/mod.ts';

export class AllUsersController implements WebApiController {
    private readonly _useCase: ListAllUsers;

    constructor(useCase: ListAllUsers) {
        this._useCase = useCase;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const output: ListAllUsersOutput = await this._useCase.execute();

        const response = {
            data: output.data,
        };

        WebApiResult.ok(ctx, response);
    }
}