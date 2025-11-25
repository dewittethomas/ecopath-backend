import { SmartMeter, SmartMeterId, MeterType, Location } from 'EcoPath/Domain/mod.ts';
import type { SmartMeterRepository } from 'EcoPath/Application/Contracts/mod.ts';

export class SmartMeterSeeder {
    constructor(private readonly smartMeterRepository: SmartMeterRepository) {}

    async seed(): Promise<void> {
        const smartMeters = [
            {
                id: SmartMeterId.create(),
                meterType: MeterType.ELECTRICITY,
                location: {
                    houseNumber: '11',
                    street: 'Main St',
                    city: 'Seoul',
                    postalCode: '1000'
                }
            },
            {
                id: SmartMeterId.create(),
                meterType: MeterType.ELECTRICITY,
                location: {
                    houseNumber: '11',
                    street: 'Main St',
                    city: 'Daejeon',
                    postalCode: '1000'
                }
            },
            {
                id: SmartMeterId.create(),
                meterType: MeterType.ELECTRICITY,
                location: {
                    houseNumber: '11',
                    street: 'Main St',
                    city: 'Daejeon',
                    postalCode: '1000'
                }
            },
            {
                id: SmartMeterId.create(),
                meterType: MeterType.GAS,
                location: {
                    houseNumber: '11',
                    street: 'Main St',
                    city: 'Seoul',
                    postalCode: '1000'
                }
            },
            {
                id: SmartMeterId.create(),
                meterType: MeterType.GAS,
                location: {
                    houseNumber: '11',
                    street: 'Main St',
                    city: 'Daejeon',
                    postalCode: '1000'
                }
            },
            {
                id: SmartMeterId.create(),
                meterType: MeterType.GAS,
                location: {
                    houseNumber: '11',
                    street: 'Main St',
                    city: 'Busan',
                    postalCode: '1000'
                }
            }
        ];

        for (const m of smartMeters) {
            console.log(`Started seeding SmartMeter (type: ${m.meterType})...`)
            const smartMeter = SmartMeter.create(
                m.id,
                m.meterType,
                Location.create(
                    m.location.houseNumber,
                    m.location.street,
                    m.location.city,
                    m.location.postalCode
                )
            );

            await this.smartMeterRepository.save(smartMeter);
            console.log(`Seeded SmartMeter ${smartMeter.id} (type: ${smartMeter.meterType}).`);
        }
    }
}
