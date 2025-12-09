import type { Repository, Entity, EntityId } from '@domaincrafters/domain';
import { Optional, IllegalStateException } from '@domaincrafters/std';
import type { RecordMapper, PgRecord, PostgreSqlClient } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';

export abstract class PostgreSqlRepository<E extends Entity> implements Repository<E> {
    protected readonly _dbClient: PostgreSqlClient;
    protected readonly _tableName: string;
    protected readonly _mapper: RecordMapper<E>;

    constructor(
        dbClient: PostgreSqlClient,
        tableName: string,
        mapper: RecordMapper<E>,
    ) {
        this._dbClient = dbClient;
        this._tableName = tableName;
        this._mapper = mapper;
    }

    async byId(id: EntityId): Promise<Optional<E>> {
        const optionalRow = await this._dbClient.findOne<PgRecord>(
            `SELECT * FROM ${this._tableName} WHERE id = $1 LIMIT 1`,
            [id.toString()],
        );

        if (!optionalRow.isPresent) {
            return Optional.empty<E>();
        }

        return Optional.of<E>(this._mapper.reconstitute(optionalRow.value));
    }

    async save(entity: E): Promise<void> {
        const record = this._mapper.toRecord(entity);

        const columns = Object.keys(record);
        const values = Object.values(record);

        const placeholders = columns.map((_, index) => `$${index + 1}`).join(',');
        const updateAssignments = columns
            .map((col, _) => `${col} = EXCLUDED.${col}`)
            .join(', ');

        const query = `
            INSERT INTO ${this._tableName} (${columns.join(', ')})
            VALUES (${placeholders})
            ON CONFLICT (id)
            DO UPDATE SET ${updateAssignments}
        `;

        const result = await this._dbClient.execute(query, values);

        if (result.rowCount === 0) {
            throw new IllegalStateException(`Failed to upsert entity with id: ${entity.id.toString()}`);
        }
    }

    async remove(entity: E): Promise<void> {
        const result = await this._dbClient.execute(
            `DELETE FROM ${this._tableName} WHERE id = $1`,
            [entity.id.toString()],
        );

        if (result.rowCount === 0) {
            throw new IllegalStateException(`Entity with id: ${entity.id.toString()} was not deleted`);
        }
    }

    async all(): Promise<E[]> {
        const rows = await this._dbClient.findMany<PgRecord>(
            `SELECT * FROM ${this._tableName}`,
            []
        );

        return rows.map(row => this._mapper.reconstitute(row));
    }
}
