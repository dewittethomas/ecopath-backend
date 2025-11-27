import { UseCase } from '@domaincrafters/application';
import { GetSensorReadingsData, SensorReadingsBySmartMeterIdAndDateQuery } from "EcoPath/Application/Contracts/mod.ts";

export interface GetSensorReadingsInput {
    smartMeterId: string;
    from: Date;
    to: Date;
}

export class GetSensorReadings
    implements UseCase<GetSensorReadingsInput, GetSensorReadingsData>
{
    private readonly _query: SensorReadingsBySmartMeterIdAndDateQuery;

    constructor(query: SensorReadingsBySmartMeterIdAndDateQuery) {
        this._query = query;
    }

    async execute(
        input: GetSensorReadingsInput
    ): Promise<GetSensorReadingsData> {

        return await this._query.fetchAll(
            input.smartMeterId,
            input.from,
            input.to
        );
    }
}