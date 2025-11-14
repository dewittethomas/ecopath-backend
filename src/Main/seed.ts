import { buildServiceProvider } from 'EcoPath/Main/mod.ts';
import { runSeeder } from 'EcoPath/Infrastructure/Persistence/PostgreSql/mod.ts';

if (import.meta.main) {
    const { provider, config } = buildServiceProvider();
    await runSeeder(provider, config);
}
