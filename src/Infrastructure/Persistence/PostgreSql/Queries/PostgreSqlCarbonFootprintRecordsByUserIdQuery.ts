import { PostgreSqlClient, PgRecord } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import type {
    CarbonFootprintRecordsByUserIdOutput,
    AverageCarbonFootprintRecordsByUserIdOutput,
    CarbonFootprintRecordsByUserIdQuery,
    CarbonFootprintRecordData
} from 'EcoPath/Application/Contracts/mod.ts';
import { CarbonFootprintData, WasteType } from "EcoPath/Domain/mod.ts";

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
                    carbonFootprintData: {
                        gasM3: footprint.gasM3,
                        electricityKWh: footprint.electricityKWh,
                        wasteKg: Object.fromEntries(footprint.wasteKg)
                    }
                };
            })
        }
    }

    async fetchAverage(userId: string): Promise<AverageCarbonFootprintRecordsByUserIdOutput> {
        const optionalRow = await this.db.findOne<{
            avg_gas: number;
            avg_electricity: number;
            avg_impact: number;
        }>(`
            SELECT AVG(gas_m3)::float as avg_gas, AVG(electricity_kwh)::float as avg_electricity, AVG(impact_co2kg)::float as avg_impact
            FROM carbon_footprint_records
            WHERE user_id = $1
        `, [userId]);

        const row = optionalRow.getOrThrow();

        const gasAverage = Math.round((row.avg_gas ?? 0) * 100) / 100;
        const electricityAverage = Math.round((row.avg_electricity ?? 0) * 100) / 100;
        const impactAverage = Math.round((row.avg_impact ?? 0) * 100) / 100;

        const wasteRows = await this.db.findMany<{
            waste_type: string;
            avg_weight: string;
        }>(`
            SELECT w.waste_type, AVG(w.weight_kg)::float AS avg_weight
            FROM carbon_footprint_records_waste w
            JOIN carbon_footprint_records r ON r.id = w.record_id
            WHERE r.user_id = $1
            GROUP BY w.waste_type
        `, [userId]);

        const wasteKg = wasteRows.reduce<Record<string, number>>((acc, row) => {
            const roundedWeight = Math.round(Number(row.avg_weight) * 100) / 100;
            acc[row.waste_type] = roundedWeight;
            return acc;
        }, {});

        return {
            userId,
            gasM3: gasAverage,
            electricityKWh: electricityAverage,
            impact: impactAverage,
            wasteKg
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
            Number(row.gas_m3),
            Number(row.electricity_kwh),
            wasteMap
        );

        return {
            id: row.id as string,
            userId: row.user_id as string,
            month: Number(row.month),
            year: Number(row.year),
            carbonFootprintData: {
                gasM3: footprint.gasM3,
                electricityKWh: footprint.electricityKWh,
                wasteKg: Object.fromEntries(footprint.wasteKg)
            }
        };
    }
}