import { UseCase } from '@domaincrafters/application';
import type { 
    CarbonFootprintRecordData,
    CarbonFootprintRecordsByUserIdQuery
} from "EcoPath/Application/Contracts/mod.ts";

export interface GetAverageCarbonFootprintRecordsInput {
    userId: string;
}

export class GetAverageSensorReadings
    implements UseCase<GetAverageCarbonFootprintRecordsInput, CarbonFootprintRecordData>
{
    private readonly _query: CarbonFootprintRecordsByUserIdQuery;

    constructor(query: CarbonFootprintRecordsByUserIdQuery) {
        this._query = query;
    }

    async execute(
        input: GetAverageCarbonFootprintRecordsInput
    ): Promise<CarbonFootprintRecordData> {

        return await this._query.fetchAverage(
            input.userId
        );
    }
}