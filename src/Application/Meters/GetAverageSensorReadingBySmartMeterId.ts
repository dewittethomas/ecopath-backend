import { UseCase } from '@domaincrafters/application';
import type { 
    AverageSensorReadingsBySmartMeterIdOutput, 
    SensorReadingsBySmartMeterIdAndDateQuery 
} from "EcoPath/Application/Contracts/mod.ts";

export interface GetAverageSensorReadingsInput {
    smartMeterId: string;
    from: Date;
    to: Date;
}

export class GetAverageSensorReadings
    implements UseCase<GetAverageSensorReadingsInput, AverageSensorReadingsBySmartMeterIdOutput>
{
    private readonly _query: SensorReadingsBySmartMeterIdAndDateQuery;

    constructor(query: SensorReadingsBySmartMeterIdAndDateQuery) {
        this._query = query;
    }

    async execute(
        input: GetAverageSensorReadingsInput
    ): Promise<AverageSensorReadingsBySmartMeterIdOutput> {

        return await this._query.fetchAverage(
            input.smartMeterId,
            input.from,
            input.to
        );
    }
}