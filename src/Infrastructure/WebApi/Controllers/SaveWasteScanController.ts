import type { UseCase } from '@domaincrafters/application';
import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import type { SaveWasteScanInput } from 'EcoPath/Application/Contracts/mod.ts';

export interface SaveWasteScanBody {
    image: string;
    timestamp: Date;
    wasteType: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    }
}

export class SaveWasteScanController implements WebApiController {
    private readonly _saveWasteScan: UseCase<SaveWasteScanInput, string>;

    constructor(saveWasteScan: UseCase<SaveWasteScanInput, string>) {
        this._saveWasteScan = saveWasteScan;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request: WebApiRequest = await WebApiRequest.create(ctx, this.validateRequest);
        const body: SaveWasteScanBody = await request.body<SaveWasteScanBody>();

        const input: SaveWasteScanInput = {
            image: body.image,
            timestamp: new Date(body.timestamp),
            wasteType: body.wasteType,
            geoLocation: {
                latitude: body.geoLocation.latitude,
                longitude: body.geoLocation.longitude
            }
        };

        const id: string = await this._saveWasteScan.execute(input);

        WebApiResult.created(ctx, `/waste-scans/${id}`);
    }

    private async validateRequest(ctx: RouterContext<string>): Promise<void> {
        const body: SaveWasteScanBody = await ctx.request.body.json() as SaveWasteScanBody;

        RequestValidator
            .create([
                () => Guard.check(body.image).againstEmpty('Image is required'),
                () => Guard.check(body.timestamp).againstEmpty('Timestamp is required'),
                () => Guard.check(body.wasteType).againstEmpty('Waste type is required'),
                () => Guard.check(body.geoLocation.latitude).againstNullOrUndefined('Latitude is required'),
                () => Guard.check(body.geoLocation.longitude).againstNullOrUndefined('Longitude is required')
            ])
            .onValidationFailure('Invalid request: Missing or malformed data')
            .validate();
    }
}