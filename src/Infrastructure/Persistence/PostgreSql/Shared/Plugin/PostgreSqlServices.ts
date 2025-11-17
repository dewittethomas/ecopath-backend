import type {
    ServiceCollection,
    ServiceFactory,
    ServiceProvider,
    ServiceDisposer
} from '@domaincrafters/di';
import { Client } from '@db/postgres';
import type { Config } from 'EcoPath/Infrastructure/Shared/Config.ts';

import {
    PostgreSqlClient,
    PostgreSqlUnitOfWork
} from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import { 
    PostgreSqlSensorReadingsBySmartMeterIdAndDateQuery, 
    PostgreSqlCarbonFootprintRecordsByUserIdQuery 
} from "EcoPath/Infrastructure//Persistence/PostgreSql/mod.ts";

export class PostgreSqlServices {

    static add(
        config: Config,
        services: ServiceCollection
    ): void {
        this.addPostgreSqlClient(config, services)
            .addUnitOfWork(services);
    }

    static addPostgreSqlClient(
        config: Config,
        services: ServiceCollection
    ): typeof PostgreSqlServices {
        services.addScoped(
            'postgreSqlClient',
            this.buildPostgreSqlClientFactory(config),
            this.buildPostgreSqlClientDisposer()
        );

        return this;
    }

    static addUnitOfWork(
        services: ServiceCollection
    ): typeof PostgreSqlServices {

        services.addScoped(
            'postgreSqlUnitOfWork',
            async (provider: ServiceProvider) => {
                const clientWrapper = (await provider.getService<PostgreSqlClient>('postgreSqlClient')).value;
                return new PostgreSqlUnitOfWork(clientWrapper);
            }
        );

        return this;
    }

    static addQueries(serviceCollection: ServiceCollection): typeof PostgreSqlServices {
        serviceCollection.addScoped(
            'sensorReadingsBySmartMeterIdAndDate',
            async (_serviceProvider: ServiceProvider) => {
                const postgreSqlClient: PostgreSqlClient =
                    (await _serviceProvider.getService<PostgreSqlClient>('postgreSqlClient')).value;

                return new PostgreSqlSensorReadingsBySmartMeterIdAndDateQuery(postgreSqlClient);
            }
        );

        serviceCollection.addScoped(
            'carbonFootprintRecordsByUserId',
            async (_serviceProvider: ServiceProvider) => {
                const postgreSqlClient: PostgreSqlClient =
                    (await _serviceProvider.getService<PostgreSqlClient>('postgreSqlClient')).value;

                return new PostgreSqlCarbonFootprintRecordsByUserIdQuery(postgreSqlClient);
            }
        );

        return this;
    }

    private static buildPostgreSqlClientFactory(config: Config): ServiceFactory {
        return async (): Promise<PostgreSqlClient> => {
            const host = config.get('PERSISTENCE_POSTGRESQL_HOSTNAME');
            const db = config.get('PERSISTENCE_POSTGRESQL_DATABASE');
            const port = config.get('PERSISTENCE_POSTGRESQL_PORT');
            const user = config.get('PERSISTENCE_POSTGRESQL_USER');
            const pass = config.get('PERSISTENCE_POSTGRESQL_PASSWORD');

            const connectionString = PostgreSqlClient.createConnectionString(
                host,
                db,
                port,
                user,
                pass
            );

            const client = new Client(connectionString);
            const wrapped = new PostgreSqlClient(client);

            await wrapped.connect();
            return wrapped;
        };
    }

    private static buildPostgreSqlClientDisposer(): ServiceDisposer<PostgreSqlClient> {
        return async (client: PostgreSqlClient): Promise<void> => {
            console.log('Disposing PostgreSqlClient');
            await client.close();
        };
    }
}
