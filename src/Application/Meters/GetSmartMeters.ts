import { UseCase } from '@domaincrafters/application';
import { GetSmartMetersData, AllSmartMetersQuery } from 'EcoPath/Application/Contracts/mod.ts';

export class GetSmartMeters
    implements UseCase<void, GetSmartMetersData[]>
{
    private readonly _query: AllSmartMetersQuery;

    constructor(query: AllSmartMetersQuery) {
        this._query = query;
    }

    async execute(): Promise<GetSmartMetersData[]> {
        return await this._query.fetchAll();
    }
}
