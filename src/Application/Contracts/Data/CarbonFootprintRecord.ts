export interface CarbonFootprintRecord {
    id: string;
    userId: string;
    month: number;
    year: number;

    totalGasUsage: number;
    totalElectricityUsage: number;

    totalWaste: Record<string, number>; // wasteType → kg
}