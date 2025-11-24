import { SensorReadingRecord, CarbonFootprintRecord } from 'EcoPath/Application/Contracts/mod.ts';

export interface GetSensorReadingsData {
    smartMeterId: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    values: SensorReadingRecord[]
}

export interface GetAverageSensorReadingsData {
    smartMeterId: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    average: number;
}

export interface GetGroupedAverageSensorReadingsData {
    smartMeterId: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    interval: 'day' | 'week' | 'month';
    values: SensorReadingRecord[];
}

export interface GetGroupedAverageSensorReadingsData {
    smartMeterId: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    interval: 'day' | 'week' | 'month';
    values: SensorReadingRecord[];
}

export interface GetGroupedAverageByCitySensorReadingsData {
    city: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    interval: 'day' | 'week' | 'month';
    values: SensorReadingRecord[];
}

export interface SensorReadingsBySmartMeterIdAndDateQuery {
    fetchAll(
        smartMeterId: string,
        from: Date,
        to: Date
    ): Promise<GetSensorReadingsData>;

    fetchAverage(
        smartMeterId: string,
        from: Date,
        to: Date
    ): Promise<GetAverageSensorReadingsData>;

    fetchGroupedAverage(
        smartMeterId: string,
        from: Date,
        to: Date,
        interval: 'day' | 'week' | 'month'
    ): Promise<GetGroupedAverageSensorReadingsData>;

    fetchGroupedAverageByCity(
        city: string,
        type: string,
        from: Date,
        to: Date,
        interval: 'day' | 'week' | 'month'
    ): Promise<GetGroupedAverageByCitySensorReadingsData>
}

export interface GetSmartMetersData {
    id: string;
    meterType: string;
    location: {
        houseNumber: string;
        street: string;
        city: string;
        postalCode: string;
    };
}

export interface AllSmartMetersQuery {
    fetchAll(): Promise<GetSmartMetersData[]>;
}

export interface CarbonFootprintRecordsByUserIdQuery {
    fetchAll(userId: string): Promise<CarbonFootprintRecord[]>;
    fetchByMonth(userId: string, month: number, year: number): Promise<CarbonFootprintRecord | null>;
}