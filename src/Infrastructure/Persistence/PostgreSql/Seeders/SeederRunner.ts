import type { ServiceProvider } from '@domaincrafters/di';
import { Config } from 'EcoPath/Infrastructure/Shared/Config.ts';
import { type UnitOfWork, type UserRepository, type SmartMeterRepository, type SensorReadingRepository } from 'EcoPath/Application/Contracts/mod.ts';
import { UserSeeder, SmartMeterSeeder, SensorReadingSeeder } from 'EcoPath/Infrastructure/Persistence/PostgreSql/mod.ts';

export async function runSeeder(provider: ServiceProvider, config: Config): Promise<void> {
    const scope = provider.createScope();

    const unitOfWork =
        (await scope.getService<UnitOfWork>('postgreSqlUnitOfWork')).getOrThrow();
    const userRepository =
        (await scope.getService<UserRepository>('postgreSqlUserRepository'))
        .getOrThrow();
    const smartMeterRepository =
        (await scope.getService<SmartMeterRepository>('postgreSqlSmartMeterRepository'))
        .getOrThrow();
    const sensorReadingRepository =
        (await scope.getService<SensorReadingRepository>('postgreSqlSensorReadingRepository'))
        .getOrThrow();

    await unitOfWork.do(async () => {
        await new UserSeeder(userRepository).seed();
        await new SmartMeterSeeder(smartMeterRepository).seed();
        await new SensorReadingSeeder(
            smartMeterRepository,
            sensorReadingRepository,
            config,
        ).seed();
    });

    await scope.dispose();
    console.log('Database seeded');
}