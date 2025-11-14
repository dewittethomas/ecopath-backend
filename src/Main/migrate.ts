import { runMigrations } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Migrations/Migrate.ts';

if (import.meta.main) {
    await runMigrations();
}