import type { ServiceCollection, ServiceProvider } from '@domaincrafters/di';
import {
    PostgreSqlClient,
    PostgreSqlServices,
} from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import type { Config } from 'EcoPath/Infrastructure/Shared/mod.ts';
import {
    UserRecordMapper,
    SmartMeterRecordMapper,
    SensorReadingRecordMapper,
    CarbonFootprintRecordMapper,
    WasteScanRecordMapper,
    PickupRequestMapper,
    PostgreSqlUserRepository,
    PostgreSqlSmartMeterRepository,
    PostgreSqlSensorReadingRepository,
    PostgreSqlCarbonFootprintRecordRepository,
    PostgreSqlWasteScanRepository,
    PostgreSqlAllSmartMetersQuery,
    PostgreSqlSensorReadingsBySmartMeterIdAndDateQuery,
    PostgreSqlCarbonFootprintRecordsByUserIdQuery,
    PostgreSqlPickupRequestRepository
} from 'EcoPath/Infrastructure/Persistence/PostgreSql/mod.ts';

export class PersistenceModule {
    static add(serviceCollection: ServiceCollection, config: Config): void {
        PostgreSqlServices.add(config, serviceCollection);

        this.addRepositories(serviceCollection)
            .addQueries(serviceCollection);
    }

    static addRepositories(serviceCollection: ServiceCollection): typeof PersistenceModule {
        serviceCollection
            .addScoped(
                'postgreSqlUserRepository',
                async (serviceProvider: ServiceProvider) => {
                    const client =
                        (await serviceProvider.getService<PostgreSqlClient>('postgreSqlClient'))
                            .getOrThrow();

                    const userDocumentMapper = new UserRecordMapper();

                    return new PostgreSqlUserRepository(
                        client,
                        userDocumentMapper,
                    );
                },
            )
            .addScoped(
                'postgreSqlSmartMeterRepository',
                async (serviceProvider: ServiceProvider) => {
                    const client = 
                        (await serviceProvider.getService<PostgreSqlClient>('postgreSqlClient'))
                            .getOrThrow();

                    const smartMeterDocumentMapper = new SmartMeterRecordMapper();

                    return new PostgreSqlSmartMeterRepository(
                        client,
                        smartMeterDocumentMapper
                    )
                }
            )
            .addScoped(
                'postgreSqlSensorReadingRepository',
                async(serviceProvider: ServiceProvider) => {
                    const client = 
                        (await serviceProvider.getService<PostgreSqlClient>('postgreSqlClient'))
                            .getOrThrow();
                    const sensorReadingDocumentMapper = new SensorReadingRecordMapper();

                    return new PostgreSqlSensorReadingRepository(
                        client,
                        sensorReadingDocumentMapper
                    )
                }
            )
            .addScoped(
                'postgreSqlCarbonFootprintRecordRepository',
                async(serviceProvider: ServiceProvider) => {
                    const client = 
                        (await serviceProvider.getService<PostgreSqlClient>('postgreSqlClient'))
                            .getOrThrow();
                    const carbonFootprintDocumentMapper = new CarbonFootprintRecordMapper();

                    return new PostgreSqlCarbonFootprintRecordRepository(
                        client,
                        carbonFootprintDocumentMapper
                    )
                }
            )
            .addScoped(
                'postgreSqlWasteScanRepository',
                async(serviceProvider: ServiceProvider) => {
                    const client = 
                        (await serviceProvider.getService<PostgreSqlClient>('postgreSqlClient'))
                            .getOrThrow();
                    const wasteScanDocumentMapper = new WasteScanRecordMapper();

                    return new PostgreSqlWasteScanRepository(
                        client,
                        wasteScanDocumentMapper
                    )
                }
            )
            .addScoped(
                'postgreSqlPickupRequestRepository',
                async(serviceProvider: ServiceProvider) => {
                    const client = 
                        (await serviceProvider.getService<PostgreSqlClient>('postgreSqlClient'))
                            .getOrThrow();
                    const pickupRequestDocumentMapper = new PickupRequestMapper();

                    return new PostgreSqlPickupRequestRepository(
                        client,
                        pickupRequestDocumentMapper
                    )
                }
            )
        return this;
    }
    
    static addQueries(serviceCollection: ServiceCollection): typeof PersistenceModule {
        serviceCollection
            .addScoped(
                'allSmartMetersQuery',
                async (_serviceProvider: ServiceProvider) => {
                    const postgreSqlClient: PostgreSqlClient =
                        (await _serviceProvider.getService<PostgreSqlClient>('postgreSqlClient')).value;

                    return new PostgreSqlAllSmartMetersQuery(postgreSqlClient);
                }
            )
            .addScoped(
                'sensorReadingsBySmartMeterIdAndDateQuery',
                async (_serviceProvider: ServiceProvider) => {
                    const postgreSqlClient: PostgreSqlClient =
                        (await _serviceProvider.getService<PostgreSqlClient>('postgreSqlClient')).value;

                    return new PostgreSqlSensorReadingsBySmartMeterIdAndDateQuery(postgreSqlClient);
                }
            )
            .addScoped(
                'carbonFootprintRecordsByUserIdQuery',
                async (_serviceProvider: ServiceProvider) => {
                    const postgreSqlClient: PostgreSqlClient =
                        (await _serviceProvider.getService<PostgreSqlClient>('postgreSqlClient')).value;
                    
                    return new PostgreSqlCarbonFootprintRecordsByUserIdQuery(postgreSqlClient);
                }
            )

        return this;
    }
}
