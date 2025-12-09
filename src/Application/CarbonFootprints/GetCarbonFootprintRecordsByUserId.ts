import { UseCase } from '@domaincrafters/application';
import type { 
    CarbonFootprintRecordsByUserIdOutput,
    CarbonFootprintRecordsByUserIdQuery
} from "EcoPath/Application/Contracts/mod.ts";

export interface GetCarbonFootprintRecordsInput {
    userId: string;
}

export class GetAverageSensorReadings
    implements UseCase<GetCarbonFootprintRecordsInput, CarbonFootprintRecordsByUserIdOutput>
{
    private readonly _query: CarbonFootprintRecordsByUserIdQuery;

    constructor(query: CarbonFootprintRecordsByUserIdQuery) {
        this._query = query;
    }

    async execute(
        input: GetCarbonFootprintRecordsInput
    ): Promise<CarbonFootprintRecordsByUserIdOutput> {

        return await this._query.fetch(
            input.userId
        );
    }
}