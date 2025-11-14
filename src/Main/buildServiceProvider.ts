import { PersistenceModule, WebApiModule } from 'EcoPath/Main/mod.ts';
import { DIServiceCollection, DIServiceProvider } from '@domaincrafters/di';
import { Config } from 'EcoPath/Infrastructure/Shared/mod.ts';

export function buildServiceProvider() {
    const config = Config.create();
    const services = DIServiceCollection.create();

    PersistenceModule.add(services, config);
    WebApiModule.add(services, config);

    const provider = DIServiceProvider.create(services);

    return { provider, config };
}