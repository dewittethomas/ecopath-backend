import {
    CarbonFootprintRecord,
    CarbonFootprintRecordId,
    CarbonFootprintData,
    CarbonFootprintCalculator,
    WasteType,
    UserId
} from 'EcoPath/Domain/mod.ts';

import type { CarbonFootprintRecordRepository, UserRepository } from 'EcoPath/Application/Contracts/mod.ts';

export class CarbonFootprintRecordSeeder {
    constructor(
        private readonly carbonFootprintRecordRepository: CarbonFootprintRecordRepository,
        private readonly userRepository: UserRepository
    ) {}

    async seed(): Promise<void> {
        const users = await this.userRepository.all();
        const currentYear = new Date().getFullYear();

        for (const user of users) {
            console.log(`Started seeding CarbonFootprintRecords for User ${user.id}...`);

            for (let month = 1; month <= 12; month++) {
                const gasM3 = this.randomUsage(20, 80);
                const electricityKWh = this.randomUsage(50, 200);

                const wasteMap = new Map<WasteType, number>([
                    [WasteType.Glass, this.randomUsage(1, 5)],
                    [WasteType.Plastic, this.randomUsage(2, 8)],
                    [WasteType.Metal, this.randomUsage(0.5, 3)],
                    [WasteType.PaperAndCardboard, this.randomUsage(2, 10)],
                    [WasteType.GeneralWaste, this.randomUsage(5, 15)],
                    [WasteType.BioWaste, this.randomUsage(3, 10)]
                ]);

                const carbonFootprint = CarbonFootprintData.create(
                    gasM3,
                    electricityKWh,
                    wasteMap
                );

                const impact = CarbonFootprintCalculator.calculate(carbonFootprint);

                const userId = UserId.create(user.id.value);

                const record = CarbonFootprintRecord.create(
                    CarbonFootprintRecordId.create(),
                    userId,
                    month,
                    currentYear,
                    carbonFootprint,
                    impact
                );

                await this.carbonFootprintRecordRepository.save(record);
            }
            console.log(`Seeded CarbonFootprintRecords for User ${user.id}.`);
        }
    }

    private randomUsage(min: number, max: number): number {
        return Number((Math.random() * (max - min) + min).toFixed(2));
    }
}