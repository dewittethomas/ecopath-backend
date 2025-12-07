import type { UseCase } from '@domaincrafters/application';
import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { SavePickupRequestInput } from 'EcoPath/Application/Contracts/mod.ts';

export interface SavePickupRequestBody {
    location: {
        houseNumber: string;
        street: string;
        city: string;
        postalCode: string;
    }
    image: string;
    timestamp: Date;
    notes?: string;
}

export class SavePickupRequestController implements WebApiController {
    private readonly _savePickupRequest: UseCase<SavePickupRequestInput, string>;

    constructor(savePickupRequest: UseCase<SavePickupRequestInput, string>) {
        this._savePickupRequest = savePickupRequest;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request: WebApiRequest = await WebApiRequest.create(ctx, this.validateRequest);
        const body: SavePickupRequestBody = await request.body<SavePickupRequestBody>();

        const input: SavePickupRequestInput = {
            location: {
                houseNumber: body.location.houseNumber,
                street: body.location.street,
                city: body.location.city,
                postalCode: body.location.postalCode
            },
            image: body.image,
            timestamp: new Date(body.timestamp),
            notes: body.notes
        };

        const id: string = await this._savePickupRequest.execute(input);

        WebApiResult.created(ctx, `/pickup-requests/${id}`);
    }

    private async validateRequest(ctx: RouterContext<string>): Promise<void> {
        const body: SavePickupRequestBody = await ctx.request.body.json() as SavePickupRequestBody;

        RequestValidator
            .create([
                () => Guard.check(body.location).againstNullOrUndefined('Location is required'),
                () => Guard.check(body.location.houseNumber).againstEmpty('HouseNumber is required'),
                () => Guard.check(body.location.street).againstEmpty('Street is required'),
                () => Guard.check(body.location.city).againstEmpty('City is required'),
                () => Guard.check(body.location.postalCode).againstEmpty('Postal code is required'),
                () => Guard.check(body.image).againstEmpty('Image is required'),
                () => Guard.check(body.timestamp).againstEmpty('Timestamp is required'),
            ])
            .onValidationFailure('Invalid request: Missing or malformed data')
            .validate();
    }
}