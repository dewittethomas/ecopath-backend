import { AllSmartMetersQuery, GetSmartMetersData } from 'EcoPath/Application/Contracts/mod.ts';
import { PostgreSqlClient } from 'EcoPath/Infrastructure/Persistence/PostgreSql/Shared/mod.ts';

export class PostgreSqlAllSmartMetersQuery implements AllSmartMetersQuery {
    constructor(private readonly db: PostgreSqlClient) {}

    async fetch(): Promise<GetSmartMetersData[]> {
        const rows = await this.db.findMany<{
            id: string;
            meter_type: string;
            house_number: string;
            street: string;
            city: string;
            postal_code: string;
        }>(
            `
            SELECT id, meter_type, house_number, street, city, postal_code
            FROM smart_meters
            ORDER BY id ASC
            `,
            []
        );

        return rows.map(r => ({
            id: r.id,
            meterType: r.meter_type,
            location: {
                houseNumber: r.house_number,
                street: r.street,
                city: r.city,
                postalCode: r.postal_code
            }
        }));
    }
}
