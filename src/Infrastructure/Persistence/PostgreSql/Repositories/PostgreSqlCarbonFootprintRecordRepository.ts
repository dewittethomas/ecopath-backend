import { CarbonFootprintRecord } from "EcoPath/Domain/mod.ts";
import type { CarbonFootprintRecordRepository } from "EcoPath/Application/Contracts/mod.ts";
import { type RecordMapper, type PostgreSqlClient, PostgreSqlRepository } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';

export class PostgreSqlCarbonFootprintRecordRepository 
    extends PostgreSqlRepository<CarbonFootprintRecord>
    implements CarbonFootprintRecordRepository 
{
    constructor(
        client: PostgreSqlClient,
        mapper: RecordMapper<CarbonFootprintRecord>,
    ) {
        super(client, 'carbon_footprint_records', mapper);
    }

    override async save(entity: CarbonFootprintRecord): Promise<void> {
        const record = this._mapper.toRecord(entity);

        const columns = Object.keys(record);
        const values = Object.values(record);

        const placeholders = columns.map((_, index) => `$${index + 1}`).join(',');
        const updateAssignments = columns
            .filter(col => col !== 'id')
            .map((col, _) => `${col} = EXCLUDED.${col}`)
            .join(', ');

        const query = `
            INSERT INTO ${this._tableName} (${columns.join(', ')})
            VALUES (${placeholders})
            ON CONFLICT (user_id, month, year)
            DO UPDATE SET ${updateAssignments}
            RETURNING id
        `;

        const result = await this._dbClient.execute(query, values);
        const recordId = result.rows[0][0];

        const wasteEntries = [...entity.carbonFootprintData.wasteKg.entries()];

        if (wasteEntries.length === 0) return;

        const wastePlaceholders: string[] = [];
        const wasteParams: unknown[] = [];

        let index = 0;

        for (const [wasteType, weight] of wasteEntries) {
            const base = index * 3;

            wastePlaceholders.push(
                `($${base + 1}, $${base + 2}, $${base + 3})`
            );

            wasteParams.push(
                recordId,
                wasteType,
                weight
            );

            index++;
        };

        const wasteQuery = `
            INSERT INTO carbon_footprint_records_waste (record_id, waste_type, weight_kg)
            VALUES ${wastePlaceholders.join(', ')}
            ON CONFLICT (record_id, waste_type)
            DO UPDATE SET weight_kg = EXCLUDED.weight_kg
        `;

        await this._dbClient.execute(wasteQuery, wasteParams);
    }
}