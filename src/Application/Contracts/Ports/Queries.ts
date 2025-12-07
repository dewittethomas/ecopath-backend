import type { SensorReadingRecordData, CarbonFootprintRecordData } from "EcoPath/Application/Contracts/mod.ts";

export type Interval = 'day' | 'week' | 'month';

export interface SensorReadingsBySmartMeterIdOutput {
    smartMeterId: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    values: SensorReadingRecordData[]
}

export interface AverageSensorReadingsBySmartMeterIdOutput {
    smartMeterId: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    average: number;
}

export interface GroupedAverageSensorReadingsBySmartMeterIdOutput {
    smartMeterId: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    interval: Interval;
    values: SensorReadingRecordData[];
}

export interface SensorReadingsBySmartMeterIdAndDateQuery {
    fetch(
        smartMeterId: string,
        from: Date,
        to: Date
    ): Promise<SensorReadingsBySmartMeterIdOutput>;

    fetchAverage(
        smartMeterId: string,
        from: Date,
        to: Date
    ): Promise<AverageSensorReadingsBySmartMeterIdOutput>;

    fetchGroupedAverage(
        smartMeterId: string,
        from: Date,
        to: Date,
        interval: Interval
    ): Promise<GroupedAverageSensorReadingsBySmartMeterIdOutput>;
}

export interface SensorReadingsByCityOutput {
    city: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    values: SensorReadingRecordData[]
}

export interface AverageSensorReadingsByCityOutput {
    city: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    average: number;
}

export interface GroupedAverageSensorReadingsByCityOutput {
    city: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    interval: Interval;
    values: SensorReadingRecordData[];
}

export interface SensorReadingsByCityAndDateQuery {
    fetch(
        city: string,
        type: string,
        from: Date,
        to: Date
    ): Promise<SensorReadingsByCityOutput>;

    fetchAverage(
        city: string,
        type: string,
        from: Date,
        to: Date
    ): Promise<AverageSensorReadingsByCityOutput>;

    fetchGroupedAverage(
        city: string,
        type: string,
        from: Date,
        to: Date,
        interval: Interval
    ): Promise<GroupedAverageSensorReadingsByCityOutput>;
}

export interface CarbonFootprintRecordsByUserIdOutput {
    data: CarbonFootprintRecordData[];
}

export interface CarbonFootprintRecordsByUserIdByMonthOutput {
    data: CarbonFootprintRecordData[];
}

export interface CarbonFootprintRecordsByUserIdQuery {
    fetch(userId: string): Promise<CarbonFootprintRecordsByUserIdOutput>;
    fetchByMonth(userId: string, month: number, year: number): Promise<CarbonFootprintRecordData | null>;
}