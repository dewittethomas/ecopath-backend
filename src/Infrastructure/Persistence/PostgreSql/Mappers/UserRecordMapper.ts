import type { PgRecord, RecordMapper } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import { User, UserId, UserProfile, Gender, HousingType, Location } from 'EcoPath/Domain/mod.ts';

const arrayToRecord = (array: string[]): string => array.map(key => `"${key}"`).join(',');
function reconstituteArray(value: unknown): string[] {
    if (Array.isArray(value)) {
        return [...value];
    }

    if (typeof value === 'string') {
        return value
            .replaceAll(/[{}]/g, '')
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0); 
    }

    return [];
}

export class UserRecordMapper implements RecordMapper<User> {
    toRecord(entity: User): PgRecord {
        return {
            id: entity.id.toString(),
            name: entity.name,
            email: entity.email,
            avatar_image: entity.avatarImage,

            birth_date: entity.userProfile.birthDate.toISOString(),
            gender: entity.userProfile.gender,
            housing_type: entity.userProfile.housingType,
            household_size: entity.userProfile.householdSize,
            eco_goals: `{${arrayToRecord(entity.userProfile.ecoGoals)}}`,

            house_number: entity.userProfile.location.houseNumber,
            street: entity.userProfile.location.street,
            city: entity.userProfile.location.city,
            postal_code: entity.userProfile.location.postalCode
        };
    }

    reconstitute(record: PgRecord): User {
        const location = Location.create(
            record.house_number as string,
            record.street as string,
            record.city as string,
            record.postal_code as string
        );

        const ecoGoals = reconstituteArray(record.eco_goals);

        const profile = UserProfile.create(
            new Date(record.birthDate as string),
            record.gender as Gender,
            location,
            record.housing_type as HousingType,
            Number(record.household_size),
            ecoGoals
        );

        const user = User.create(
            UserId.create(record.id as string),
            record.name as string,
            record.email as string,
            record.avatar_image as string,
            profile
        );

        return user;
    }
}