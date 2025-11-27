import { SensorReadingRecord, CarbonFootprintRecord } from 'EcoPath/Application/Contracts/mod.ts';

export type Interval = 'day' | 'week' | 'month';

export interface AllSmartMetersData {
    id: string;
    meterType: string;
    location: {
        houseNumber: string;
        street: string;
        city: string;
        postalCode: string;
    };
}

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
    interval: Interval;
    values: SensorReadingRecord[];
}

export interface GetGroupedAverageByCitySensorReadingsData {
    city: string;
    type: string;
    from: Date;
    to: Date;
    unit: string;
    interval: Interval;
    values: SensorReadingRecord[];
}

export interface WasteScanData {
    id: string;
    image: string;
    timestamp: Date;
    wasteType: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    };
}

export interface PickupRequestData {
    id: string;
    location: {
        houseNumber: string;
        street: string;
        city: string;
        postalCode: string;
    };
    image: string;
    timestamp: Date;
    notes?: string;
}

export interface ListAllWasteScansOutput {
    data: WasteScanData[];
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
        interval: Interval
    ): Promise<GetGroupedAverageSensorReadingsData>;

    fetchGroupedAverageByCity(
        city: string,
        type: string,
        from: Date,
        to: Date,
        interval: Interval
    ): Promise<GetGroupedAverageByCitySensorReadingsData>
}

export interface CarbonFootprintRecordsByUserIdQuery {
    fetchAll(userId: string): Promise<CarbonFootprintRecord[]>;
    fetchByMonth(userId: string, month: number, year: number): Promise<CarbonFootprintRecord | null>;
}