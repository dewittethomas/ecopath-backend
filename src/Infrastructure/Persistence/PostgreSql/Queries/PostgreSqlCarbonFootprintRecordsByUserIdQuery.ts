import type {
    CarbonFootprintRecordsByUserIdOutput,
    AverageCarbonFootprintRecordsByUserIdOutput,
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
            userId,
            values: rows.map(row => {
                const id = row.id as string;

                const footprint = CarbonFootprintData.create(
                    Number(row.gas_m3),
                    Number(row.electricity_kwh),
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

    async fetchAverage(userId: string): Promise<AverageCarbonFootprintRecordsByUserIdOutput> {
        const optionalRow = await this.db.findOne<PgRecord>(`
            SELECT waste_type, AVG(weight_kg)::float AS avg_weight
            FROM carbon_footprint_records_waste
            GROUP BY waste_type;
        `, []);

        const row = optionalRow.getOrThrow();

        return {
            userId,
            gasM3: row.avg_gas as number,
            electricityKWh: row.avg_electricity as number,
            wasteKg: {
                'paper': 5
            }
        }
    }

    async fetchByDate(
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
            Number(row.gasM3),
            Number(row.electricityKWh),
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