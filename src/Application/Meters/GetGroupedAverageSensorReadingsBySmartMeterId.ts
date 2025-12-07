import { UseCase } from '@domaincrafters/application';
import type {
    GroupedAverageSensorReadingsBySmartMeterIdOutput,
    SensorReadingsBySmartMeterIdAndDateQuery, 
    Interval
} from "EcoPath/Application/Contracts/mod.ts";

export interface GetGroupedAverageSensorReadingsInput {
    smartMeterId: string;
    from: Date;
    to: Date;
    interval: Interval;
}

export class GetGroupedAverageSensorReadings
    implements UseCase<GetGroupedAverageSensorReadingsInput, GetGroupedAverageSensorReadingsInput>
{
    constructor(private readonly _query: SensorReadingsBySmartMeterIdAndDateQuery) {}

    async execute(
        input: GetGroupedAverageSensorReadingsInput
    ): Promise<GroupedAverageSensorReadingsBySmartMeterIdOutput> {

        return await this._query.fetchGroupedAverage(
            input.smartMeterId,
            input.from,
            input.to,
            input.interval
        );
    }
}