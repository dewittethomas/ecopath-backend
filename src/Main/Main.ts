import { buildServiceProvider, WebApiModule } from 'EcoPath/Main/mod.ts';

const { provider } = buildServiceProvider();

await WebApiModule.use(provider);