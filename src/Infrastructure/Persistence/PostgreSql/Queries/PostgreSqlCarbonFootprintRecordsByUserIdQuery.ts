import type {
    CarbonFootprintRecordsByUserIdOutput,
    CarbonFootprintRecordsByUserIdQuery,
    CarbonFootprintRecordData
} from 'EcoPath/Application/Contracts/mod.ts';
import { CarbonFootprintData, WasteType } from "EcoPath/Domain/mod.ts";
import { PostgreSqlClient } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import { PgRecord } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';

export class PostgreSqlCarbonFootprintRecordsByUserIdQuery
    implements CarbonFootprintRecordsByUserIdQuery {

    constructor(private readonly db: PostgreSqlClient) {}

    async fetch(userId: string): Promise<CarbonFootprintRecordsByUserIdOutput> {
        const rows = await this.db.findMany<PgRecord>(`
            SELECT *
            FROM carbon_footprint_records
            WHERE user_id = $1
            ORDER BY year DESC, month DESC
        `, [userId]);

        if (rows.length === 0) return { data: []};

        const recordIds = rows.map(r => r.id);

        const wasteRows = await this.db.findMany<PgRecord>(`
            SELECT *
            FROM carbon_footprint_records_waste
            WHERE record_id = ANY($1)
        `, [recordIds]);

        const wasteMapByRecord: Record<string, Map<WasteType, number>> = {};

        for (const row of wasteRows) {
            const recordId = row.record_id as string;
            if (!wasteMapByRecord[recordId]) {
                wasteMapByRecord[recordId] = new Map();
            }
            wasteMapByRecord[recordId].set(row.waste_type as WasteType, Number(row.weight_kg));
        }

        return {
            data: rows.map(row => {
                const id = row.id as string;

                const footprint = CarbonFootprintData.create(
                    Number(row.total_gas_usage),
                    Number(row.total_electricity_usage),
                    wasteMapByRecord[id] ?? new Map<WasteType, number>()
                );

                return {
                    id,
                    userId: row.user_id as string,
                    month: Number(row.month),
                    year: Number(row.year),
                    gasM3: footprint.gasM3,
                    electricityKWh: footprint.electricityKWh,
                    wasteKg: Object.fromEntries(footprint.wasteKg)
                };
            })
        }
    }

    async fetchByMonth(
        userId: string,
        month: number,
        year: number
    ): Promise<CarbonFootprintRecordData | null> {
        const optionalRow = await this.db.findOne<PgRecord>(`
            SELECT *
            FROM carbon_footprint_records
            WHERE user_id = $1
            AND month = $2
            AND year = $3
            LIMIT 1
        `, [userId, month, year]);

        if (!optionalRow) return null;

        const row = optionalRow.getOrThrow();

        const wasteRows = await this.db.findMany<PgRecord>(`
            SELECT *
            FROM carbon_footprint_records_waste
            WHERE record_id = $1
        `, [row.id]);

        const wasteMap = new Map<WasteType, number>();
        for (const w of wasteRows) {
            wasteMap.set(w.waste_type as WasteType, Number(w.weight_kg));
        }

        const footprint = CarbonFootprintData.create(
            Number(row.total_gas_usage),
            Number(row.total_electricity_usage),
            wasteMap
        );

        return {
            id: row.id as string,
            userId: row.user_id as string,
            month: Number(row.month),
            year: Number(row.year),
            gasM3: footprint.gasM3,
            electricityKWh: footprint.electricityKWh,
            wasteKg: Object.fromEntries(footprint.wasteKg)
        };
    }
}