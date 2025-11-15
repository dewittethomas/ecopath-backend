import { SensorReading, Unit, MeterType, SmartMeter } from 'EcoPath/Domain/mod.ts';
import type {
    SmartMeterRepository,
    SensorReadingRepository
} from 'EcoPath/Application/Contracts/mod.ts';
import { Config } from 'EcoPath/Infrastructure/Shared/Config.ts';

export class SensorReadingSeeder {
    constructor(
        private readonly smartMeterRepository: SmartMeterRepository,
        private readonly sensorReadingRepository: SensorReadingRepository,
        private readonly config: Config
    ) {}

    async seed(): Promise<void> {
        const smartMeters: SmartMeter[] = await this.smartMeterRepository.findAll();
        if (smartMeters.length === 0) return;

        const now = new Date();
        const days = 31;
        const hoursBack = 24 * days;

        for (const smartMeter of smartMeters) {
            console.log(`Starting seeding SensorReadings for SmartMeter ${smartMeter.id} (type: ${smartMeter.meterType})`)
            const unit = smartMeter.meterType === MeterType.ELECTRICITY 
                ? Unit.KilowattHour
                : Unit.CubicMeter;

            for (let h = 0; h < hoursBack; h++) {
                const timestamp = new Date(now.getTime() - h * 60 * 60 * 1000);

                const reading = SensorReading.create(
                    smartMeter.id,
                    timestamp,
                    this.generateValue(smartMeter.meterType),
                    unit,
                );

                await this.sensorReadingRepository.save(reading, smartMeter.id);
                console.log(`Seeded SensorReadings for SmartMeter ${smartMeter.id} (type: ${smartMeter.meterType}) for ${days} days.`)
            }
        }
    }

    private generateValue(meterType: MeterType): number {
        if (meterType === MeterType.ELECTRICITY) {
            return Number((Math.random() * 3 + 0.5).toFixed(3)); // ~0.5–3.5 kWh
        }

        if (meterType === MeterType.GAS) {
            return Number((Math.random() * 0.9 + 0.1).toFixed(3)); // ~0.1–1.0 m³
        }

        return 0;
    }
}