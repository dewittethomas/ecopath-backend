import { buildServiceProvider } from 'EcoPath/Main/mod.ts';
import { runSeeder } from 'EcoPath/Infrastructure/Persistence/PostgreSql/mod.ts';

const { provider } = buildServiceProvider();

if (import.meta.main) {
    await runSeeder(provider);
}
