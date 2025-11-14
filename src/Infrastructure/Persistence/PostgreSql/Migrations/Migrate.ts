import { Client } from '@db/postgres';
import { join } from '@std/path';

const MIGRATIONS_DIR = './src/Infrastructure/Persistence/PostgreSql/Migrations';

export async function runMigrations() {
    const client = new Client({
        hostname: Deno.env.get('PERSISTENCE_POSTGRESQL_HOSTNAME')!,
        database: Deno.env.get('PERSISTENCE_POSTGRESQL_DATABASE')!,
        port: Number.parseInt(Deno.env.get('PERSISTENCE_POSTGRESQL_PORT') ?? '5432'),
        user: Deno.env.get('PERSISTENCE_POSTGRESQL_USER')!,
        password: Deno.env.get('PERSISTENCE_POSTGRESQL_PASSWORD')!,
    });

    await client.connect();

    await client.queryObject(`
        CREATE TABLE IF NOT EXISTS _migrations (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            executed_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `);

    const executed = await client.queryObject<{ name: string }>(`SELECT name FROM _migrations;`);
    const appliedMigrations = new Set(executed.rows.map(r => r.name));

    const migrationFiles: string[] = [];
    for await (const entry of Deno.readDir(MIGRATIONS_DIR)) {
        if (entry.isFile && entry.name.endsWith('.sql')) {
            migrationFiles.push(entry.name);
        }
    }

    migrationFiles.sort((a, b) => a.localeCompare(b));

    for (const migrationName of migrationFiles) {
        if (appliedMigrations.has(migrationName)) {
            console.log(`Already applied: ${migrationName}`);
            continue;
        }

        console.log(`Applying migration: ${migrationName}`);
        const migrationPath = join(MIGRATIONS_DIR, migrationName);
        const sql = await Deno.readTextFile(migrationPath);

        await client.queryArray('BEGIN');
        try {
            await client.queryArray(sql);
            await client.queryArray(
                `INSERT INTO _migrations (name) VALUES ($1);`,
                [migrationName]
            );
            await client.queryArray('COMMIT');
            console.log(`Applied: ${migrationName}`);
        } catch (err) {
            await client.queryArray('ROLLBACK');
            console.error(`Failed: ${migrationName}`);
            console.error(err);
            Deno.exit(1);
        }
    }

    await client.end();
    console.log('All migrations complete.');
}