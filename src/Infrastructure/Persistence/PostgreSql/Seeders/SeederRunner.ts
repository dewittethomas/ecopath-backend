import type { ServiceProvider } from '@domaincrafters/di';
import type { UnitOfWork, UserRepository, SmartMeterRepository, SensorReadingRepository, CarbonFootprintRecordRepository, WasteScanRepository, PickupRequestRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { UserSeeder, SmartMeterSeeder, SensorReadingSeeder, CarbonFootprintRecordSeeder, WasteScanSeeder, PickupRequestSeeder } from 'EcoPath/Infrastructure/Persistence/PostgreSql/mod.ts';

export async function runSeeder(provider: ServiceProvider): Promise<void> {
    const scope = provider.createScope();

    const unitOfWork =
        (await scope.getService<UnitOfWork>('postgreSqlUnitOfWork')).getOrThrow();
    const userRepository =
        (await scope.getService<UserRepository>('postgreSqlUserRepository')).getOrThrow();
    const smartMeterRepository =
        (await scope.getService<SmartMeterRepository>('postgreSqlSmartMeterRepository')).getOrThrow();
    const sensorReadingRepository =
        (await scope.getService<SensorReadingRepository>('postgreSqlSensorReadingRepository')).getOrThrow();
    const carbonFootprintRecordRepository =
        (await scope.getService<CarbonFootprintRecordRepository>('postgreSqlCarbonFootprintRecordRepository')).getOrThrow();
    const wasteScanRepository =
        (await scope.getService<WasteScanRepository>('postgreSqlWasteScanRepository')).getOrThrow();
    const pickupRequestRepository = 
        (await scope.getService<PickupRequestRepository>('postgreSqlPickupRequestRepository')).getOrThrow();

    await unitOfWork.do(async () => {
        await new UserSeeder(userRepository).seed();
        await new SmartMeterSeeder(smartMeterRepository).seed();
        await new SensorReadingSeeder(
            smartMeterRepository,
            sensorReadingRepository
        ).seed();
        await new CarbonFootprintRecordSeeder(carbonFootprintRecordRepository, userRepository).seed();
        await new WasteScanSeeder(wasteScanRepository).seed();
        await new PickupRequestSeeder(pickupRequestRepository).seed();
    });

    await scope.dispose();
    console.log('Database seeded');
}