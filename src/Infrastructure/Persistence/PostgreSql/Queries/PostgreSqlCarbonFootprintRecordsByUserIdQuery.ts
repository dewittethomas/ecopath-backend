import {
    CarbonFootprintRecord,
    CarbonFootprintRecordsByUserIdQuery
} from 'EcoPath/Application/Contracts/mod.ts';

import { PostgreSqlClient } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';
import { PgRecord } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/RecordMapper.ts';

export class PostgreSqlCarbonFootprintRecordsByUserIdQuery
    implements CarbonFootprintRecordsByUserIdQuery {

    constructor(private readonly db: PostgreSqlClient) {}

    async fetchAll(userId: string): Promise<CarbonFootprintRecord[]> {
        const rows = await this.db.findMany<PgRecord>(`
            SELECT *
            FROM carbon_footprint_records
            WHERE user_id = $1
            ORDER BY year DESC, month DESC
        `, [userId]);

        if (rows.length === 0) {
            return [];
        }

        const recordIds = rows.map(r => r.id);

        const wasteRows = await this.db.findMany<PgRecord>(`
            SELECT *
            FROM carbon_footprint_records_waste
            WHERE record_id = ANY($1)
        `, [recordIds]);

        const wasteMapByRecord: Record<string, Record<string, number>> = {};

        for (const row of wasteRows) {
            const recId = row.record_id as string;
            if (!wasteMapByRecord[recId]) {
                wasteMapByRecord[recId] = {};
            }

            wasteMapByRecord[recId][row.waste_type as string] =
                Number(row.weight_kg);
        }

        return rows.map(row => {
            const id = row.id as string;

            return {
                id,
                userId: row.user_id as string,
                month: Number(row.month),
                year: Number(row.year),
                totalGasUsage: Number(row.total_gas_usage),
                totalElectricityUsage: Number(row.total_electricity_usage),
                totalWaste: wasteMapByRecord[id] ?? {}
            };
        });
    }
}