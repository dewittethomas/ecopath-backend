export interface CarbonFootprintRecordData {
    id: string;
    userId: string;
    month: number;
    year: number;

    gasM3: number;
    electricityKWh: number;
    wasteKg: Record<string, number>;
}