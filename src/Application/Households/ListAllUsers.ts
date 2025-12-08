import { User } from 'EcoPath/Domain/mod.ts';
import type { UserRepository } from "EcoPath/Application/Contracts/mod.ts";

export interface UserData {
    id: string;
    name: string;
    email: string;
    avatarImage: string;
    userProfile: {
        birthDate: Date;
        gender: string;
        location: {
            houseNumber: string,
            street: string,
            city: string,
            postalCode: string
        }
        housingType: string;
        householdSize: number;
        ecoGoals: string[];
    }
}

export interface ListAllUsersOutput {
    data: UserData[];
}

function toUserData(entity: User): UserData {
    return {
        id: entity.id.toString(),
        name: entity.name,
        email: entity.email,
        avatarImage: entity.avatarImage,
        userProfile: {
            birthDate: entity.userProfile.birthDate,
            gender: entity.userProfile.gender,
            location: {
                houseNumber: entity.userProfile.location.houseNumber,
                street: entity.userProfile.location.street,
                city: entity.userProfile.location.city,
                postalCode: entity.userProfile.location.postalCode
            },
            housingType: entity.userProfile.housingType,
            householdSize: entity.userProfile.householdSize,
            ecoGoals: entity.userProfile.ecoGoals
        }
    };
}

export class ListAllUsers {
    private readonly _repository: UserRepository;

    constructor(repository: UserRepository) {
        this._repository = repository;
    }

    async execute(): Promise<ListAllUsersOutput> {
        const scans = await this._repository.all();
        return { data: scans.map(toUserData) };
    }
}