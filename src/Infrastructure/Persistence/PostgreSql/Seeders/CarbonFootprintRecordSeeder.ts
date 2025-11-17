import {
    CarbonFootprintRecord,
    CarbonFootprintRecordId,
    CarbonFootprint,
    UserId,
    WasteType
} from 'EcoPath/Domain/mod.ts';

import type { CarbonFootprintRecordRepository, UserRepository } from 'EcoPath/Application/Contracts/mod.ts';

export class CarbonFootprintRecordSeeder {
    constructor(
        private readonly carbonFootprintRecordRepository: CarbonFootprintRecordRepository,
        private readonly userRepository: UserRepository
    ) {}

    async seed(): Promise<void> {
        const users = await this.userRepository.findAll();

        if (users.length === 0) {
            console.error('❌ No users found. Seed users first.');
            return;
        }

        const user = users[0];
        const userId = user.id;

        console.log(`Started seeding CarbonFootprintRecords for User ${userId}...`);

        for (let month = 1; month <= 12; month++) {
            const totalGasUsage = this.randomUsage(20, 80);
            const totalElectricityUsage = this.randomUsage(50, 200);

            const wasteMap = new Map<WasteType, number>([
                [WasteType.Glass, this.randomUsage(1, 5)],
                [WasteType.Plastic, this.randomUsage(2, 8)],
                [WasteType.Metal, this.randomUsage(0.5, 3)],
                [WasteType.PaperAndCardboard, this.randomUsage(2, 10)],
                [WasteType.GeneralWaste, this.randomUsage(5, 15)],
                [WasteType.BioWaste, this.randomUsage(3, 10)]
            ]);

            const carbonFootprint = CarbonFootprint.create(
                totalGasUsage,
                totalElectricityUsage,
                wasteMap
            );

            const record = CarbonFootprintRecord.create(
                CarbonFootprintRecordId.create(),
                userId,
                month,
                2024,
                carbonFootprint
            );

            await this.carbonFootprintRecordRepository.save(record);
            console.log(
                `Seeded CarbonFootprintRecord (month: ${month}, year: 2024) for User ${userId}.`
            );
        }

        console.log(`Finished seeding CarbonFootprintRecords for User ${userId}.`);
    }

    private randomUsage(min: number, max: number): number {
        return Number((Math.random() * (max - min) + min).toFixed(2));
    }
}