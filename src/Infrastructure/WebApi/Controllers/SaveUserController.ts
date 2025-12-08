import type { UseCase } from '@domaincrafters/application';
import type { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import {
    RequestValidator,
    type WebApiController,
    WebApiRequest,
    WebApiResult,
} from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';

import type { SaveUserInput } from 'EcoPath/Application/Contracts/mod.ts';
import type { Gender, HousingType } from 'EcoPath/Domain/mod.ts';

export interface SaveUserBody {
    name: string;
    email: string;
    avatarImage: string;

    userProfile: {
        birthDate: string;
        gender: Gender;
        housingType: HousingType;
        householdSize: number;
        ecoGoals: string[];

        location: {
            houseNumber: string;
            street: string;
            city: string;
            postalCode: string;
        }
    }
}

export class SaveUserController implements WebApiController {
    private readonly _saveUser: UseCase<SaveUserInput, string>;

    constructor(saveUser: UseCase<SaveUserInput, string>) {
        this._saveUser = saveUser;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request: WebApiRequest = await WebApiRequest.create(ctx, this.validateRequest);
        const body: SaveUserBody = await request.body<SaveUserBody>();

        const input: SaveUserInput = {
            name: body.name,
            email: body.email,
            avatarImage: body.avatarImage,
            userProfile: {
                birthDate: new Date(body.userProfile.birthDate),
                gender: body.userProfile.gender,
                location: {
                    houseNumber: body.userProfile.location.houseNumber,
                    street: body.userProfile.location.street,
                    city: body.userProfile.location.city,
                    postalCode: body.userProfile.location.postalCode
                },
                housingType: body.userProfile.housingType,
                householdSize: body.userProfile.householdSize,
                ecoGoals: body.userProfile.ecoGoals,
            }
        };

        const id: string = await this._saveUser.execute(input);

        WebApiResult.created(ctx, `/users/${id}`);
    }

    private async validateRequest(ctx: RouterContext<string>): Promise<void> {
        const body: SaveUserBody = await ctx.request.body.json() as SaveUserBody;

        RequestValidator
            .create([
                () => Guard.check(body.name).againstEmpty('Name is required'),
                () => Guard.check(body.email).againstEmpty('Email is required'),
                () => Guard.check(body.avatarImage).againstEmpty('Avatar image is required'),
                () => Guard.check(body.userProfile).againstNullOrUndefined('User profile is required'),
                () => Guard.check(body.userProfile.birthDate).againstEmpty('Birth date is required'),
                () => Guard.check(body.userProfile.gender).againstEmpty('Gender is required'),
                () => Guard.check(body.userProfile.housingType).againstEmpty('Housing type is required'),
                () => Guard.check(body.userProfile.householdSize).againstZero().againstNegative(),
                () => Guard.check(body.userProfile.location).againstNullOrUndefined('Location is required'),
                () => Guard.check(body.userProfile.location.houseNumber).againstEmpty('HouseNumber is required'),
                () => Guard.check(body.userProfile.location.street).againstEmpty('Street is required'),
                () => Guard.check(body.userProfile.location.city).againstEmpty('City is required'),
                () => Guard.check(body.userProfile.location.postalCode).againstEmpty('Postal code is required'),
            ])
            .onValidationFailure('Invalid request: Missing or malformed data')
            .validate();
    }
}