import { User, UserId, UserProfile, Gender, HousingType, Location } from 'EcoPath/Domain/mod.ts';
import type { UserRepository } from 'EcoPath/Application/Contracts/mod.ts';

export class UserSeeder {
    constructor(private readonly userRepository: UserRepository) {}

    async seed(): Promise<void> {
        const users = [
            {
                id: UserId.create(),
                name: 'Demo User',
                email: 'demo@example.com',
                avatarImage: 'iVBORw0KGgoAAAANSUhEUgAAAAUA',
                birthDate: new Date('2000-01-01'),
                gender: Gender.Male,
                location: {
                    houseNumber: '11',
                    street: 'Main St',
                    city: 'Seoul',
                    postalCode: '1000'
                },
                housingType: HousingType.Apartment,
                householdSize: 1,
                ecoGoals: ['reduce_waste', 'use_bike']
            }
        ];

        for (const u of users) {
            console.log(`Started seeding User (gender: ${u.gender})...`)
            const profile = UserProfile.create(
                u.birthDate,
                u.gender,
                Location.create(
                    u.location.houseNumber,
                    u.location.street,
                    u.location.city,
                    u.location.postalCode
                ),
                u.housingType,
                u.householdSize,
                u.ecoGoals
            );

            const user = User.create(
                u.id,
                u.name,
                u.email,
                u.avatarImage,
                profile
            );

            await this.userRepository.save(user);
            console.log(`Seeded User ${user.id} (gender: ${user.userProfile.gender}).`)
        }
    }
}