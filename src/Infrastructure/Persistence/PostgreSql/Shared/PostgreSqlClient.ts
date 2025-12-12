import { Client } from '@db/postgres';
import { Guard, IllegalStateException, Optional } from "@domaincrafters/std";

export class PostgreSqlClient {
    private readonly _client: Client;

    static createConnectionString(
        hostname: string,
        database: string,
        port: string,
        user: string,
        password: string
    ): string {
        Guard.check(hostname, 'persistence_postgresql_hostname').againstEmpty().againstWhitespace();
        Guard.check(database, 'persistence_postgresql_database').againstEmpty().againstWhitespace();
        Guard.check(Number.parseInt(port), 'persistence_postgresql_port').againstZero().againstNegative();

        const credentials: string = user && password ? `${user}:${password}` : '';
        return `postgres://${credentials}@${hostname}:${port}/${database}`;
    }

    constructor(client: Client) {
        this._client = client;
    }

    async connect(): Promise<void> {
        try {
            await this._client.connect();
            console.log('PostgreSQL connection established');
        } catch (error: unknown) {
            throw this.convertErrorToIllegalStateException(error, 'Failed to connect to PostgreSQL');
        }
    }

    async close(): Promise<void> {
        try {
            await this._client.end();
            console.log('PostgreSQL connection closed');
        } catch (error: unknown) {
            throw this.convertErrorToIllegalStateException(error, 'Failed to close PostgreSQL connection');
        }
    }

    async findOne<T>(query: string, params: unknown[]): Promise<Optional<T>> {
        const result = await this._client.queryObject<T>(query, params);

        return result.rows.length === 0
            ? Optional.empty<T>()
            : Optional.of<T>(result.rows[0] as T);
    }

    async findMany<T>(query: string, params: unknown[]): Promise<T[]> {
        const result = await this._client.queryObject<T>(query, params);
        return result.rows;
    }

    async insert<T>(query: string, params: unknown[]): Promise<void> {
        await this._client.queryArray(query, params);
    }

    async update<T>(query: string, params: unknown[]): Promise<void> {
        await this._client.queryArray(query, params);
    }

    async delete(query: string, params: unknown[]): Promise<void> {
        await this._client.queryArray(query, params);
    }

    async execute(query: string, params: unknown[]): Promise<{ rowCount: number; rows: unknown[][] }> {
        const result = await this._client.queryArray(query, params);
        return {
            rowCount: result.rowCount ?? 0,
            rows: result.rows ?? []
        };
    }

    async transaction<T>(fn: () => Promise<T>): Promise<T> {
        try {
            await this._client.queryArray('BEGIN');
            const result = await fn();
            await this._client.queryArray('COMMIT');
            return result;
        } catch (error) {
            await this._client.queryArray('ROLLBACK');
            throw this.convertErrorToIllegalStateException(error, 'Transaction failed');
        }
    }

    private convertErrorToIllegalStateException(
        error: unknown,
        msg: string,
    ): IllegalStateException {
        const message: string = `${msg}: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
        return new IllegalStateException(message);
    }
}