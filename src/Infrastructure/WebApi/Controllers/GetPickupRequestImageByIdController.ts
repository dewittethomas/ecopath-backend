import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { UseCase } from '@domaincrafters/application';
import { PickupRequestId } from "EcoPath/Domain/mod.ts";
import type { GetWasteScanImageByIdOutput } from 'EcoPath/Application/Contracts/mod.ts';

export class GetPickupRequestImageByIdController implements WebApiController {
    private readonly _getPickupRequestImageById: UseCase<PickupRequestId, GetWasteScanImageByIdOutput>;

    constructor(getPickupRequestImageById: UseCase<PickupRequestId, GetWasteScanImageByIdOutput>) {
        this._getPickupRequestImageById = getPickupRequestImageById;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        await WebApiRequest.create(ctx, this.validateRequest);

        const pickupRequestId = PickupRequestId.create(ctx.params.pickupRequestId);
        const result = await this._getPickupRequestImageById.execute(pickupRequestId);

        WebApiResult.ok(ctx, result);
    }

    private validateRequest(ctx: RouterContext<string>): Promise<void> {
        RequestValidator
            .create([
                () => Guard.check(ctx.params.pickupRequestId).againstEmpty('pickupRequestId is required'),
            ])
            .onValidationFailure('Invalid request for pickup requests..')
            .validate();

        return Promise.resolve();
    }
}