import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { UseCase } from '@domaincrafters/application';
import { WasteScanId } from "EcoPath/Domain/mod.ts";
import type { GetWasteScanImageByIdOutput } from 'EcoPath/Application/Contracts/mod.ts';

export class GetWasteScanImageByIdController implements WebApiController {
    private readonly _getWasteScanImageById: UseCase<WasteScanId, GetWasteScanImageByIdOutput>;

    constructor(getWasteScanImageById: UseCase<WasteScanId, GetWasteScanImageByIdOutput>) {
        this._getWasteScanImageById = getWasteScanImageById;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        await WebApiRequest.create(ctx, this.validateRequest);

        const wasteScanId = WasteScanId.create(ctx.params.wasteScanId);
        const result = await this._getWasteScanImageById.execute(wasteScanId);

        WebApiResult.ok(ctx, result);
    }

    private validateRequest(ctx: RouterContext<string>): Promise<void> {
        RequestValidator
            .create([
                () => Guard.check(ctx.params.wasteScanId).againstEmpty('wasteScanId is required'),
            ])
            .onValidationFailure('Invalid request for waste scans.')
            .validate();

        return Promise.resolve();
    }
}