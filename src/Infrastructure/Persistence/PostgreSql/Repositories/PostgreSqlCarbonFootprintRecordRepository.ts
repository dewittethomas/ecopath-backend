import type { CarbonFootprintRecord } from "EcoPath/Domain/mod.ts";
import type { CarbonFootprintRecordRepository } from "EcoPath/Application/Contracts/mod.ts";
import { type RecordMapper, type PostgreSqlClient, PostgreSqlRepository } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import type { PgRecord } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';

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
    
    async allByUserId(userId: string): Promise<CarbonFootprintRecord[]> {
        const footprintRows = await this._dbClient.findMany<PgRecord>(
            `
            SELECT *
            FROM carbon_footprint_records
            WHERE user_id = $1
            ORDER BY year DESC, month DESC
            `,
            [userId]
        );

        if (footprintRows.length === 0) {
            return [];
        }

        const recordIds = footprintRows.map((r: PgRecord) => r.id);

        const wasteRows = await this._dbClient.findMany<PgRecord>(
            `
            SELECT *
            FROM carbon_footprint_records_waste
            WHERE record_id = ANY($1)
            `,
            [recordIds]
        );

        const wasteMapByRecord: Record<string, Map<string, number>> = {};

        for (const row of wasteRows) {
            const recId = row.record_id as string;

            if (!wasteMapByRecord[recId]) {
                wasteMapByRecord[recId] = new Map();
            }

            wasteMapByRecord[recId].set(
                row.waste_type as string,
                Number(row.weight_kg)
            );
        }

        return footprintRows.map((row: PgRecord) => {
            const id = row.id as string; 
            const wasteMap = wasteMapByRecord[id] ?? new Map();

            const rowWithWaste: PgRecord = {
                ...row,
                waste_map: wasteMap
            };

            return this._mapper.reconstitute(rowWithWaste);
        });
    }

    async allByUserIdAndMonth(
        userId: string,
        month: number,
        year: number
    ): Promise<CarbonFootprintRecord | null> {
        const result = await this._dbClient.findOne<PgRecord>(
            `
            SELECT *
            FROM carbon_footprint_records
            WHERE user_id = $1
            AND month = $2
            AND year = $3
            LIMIT 1
            `,
            [userId, month, year]
        );

        if (!result) {
            return null;
        }

        const row = result as unknown as PgRecord;
        const recordId = row.id as string;

        const wasteRows = await this._dbClient.findMany<PgRecord>(
            `
            SELECT *
            FROM carbon_footprint_records_waste
            WHERE record_id = $1
            `,
            [recordId]
        );

        const wasteMap = new Map<string, number>();
        for (const w of wasteRows) {
            wasteMap.set(
                w.waste_type as string,
                Number(w.weight_kg)
            );
        }

        const rowWithWaste: PgRecord = {
            ...row,
            waste_map: wasteMap
        };

        return this._mapper.reconstitute(rowWithWaste);
    }
}