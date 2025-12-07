import { UseCase } from '@domaincrafters/application';
import type { 
    SensorReadingsBySmartMeterIdOutput, 
    SensorReadingsBySmartMeterIdAndDateQuery 
} from "EcoPath/Application/Contracts/mod.ts";

export interface GetSensorReadingsInput {
    smartMeterId: string;
    from: Date;
    to: Date;
}

export class GetSensorReadings
    implements UseCase<GetSensorReadingsInput, SensorReadingsBySmartMeterIdOutput>
{
    private readonly _query: SensorReadingsBySmartMeterIdAndDateQuery;

    constructor(query: SensorReadingsBySmartMeterIdAndDateQuery) {
        this._query = query;
    }

    async execute(
        input: GetSensorReadingsInput
    ): Promise<SensorReadingsBySmartMeterIdOutput> {
        return await this._query.fetch(
            input.smartMeterId,
            input.from,
            input.to
        );
    }
}