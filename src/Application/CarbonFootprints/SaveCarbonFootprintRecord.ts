import type { UseCase } from '@domaincrafters/application';
import type { CarbonFootprintRecordRepository, UnitOfWork } from 'EcoPath/Application/Contracts/mod.ts';
import {
    CarbonFootprintRecord,
    CarbonFootprintRecordId,
    CarbonFootprint,
    WasteType,
    UserId
} from 'EcoPath/Domain/mod.ts';

export interface SaveCarbonFootprintRecordInput {
    id: string;
    userId: string;
    year: number;
    month: number;
    CarbonFootprint: {
        totalGasUsage: number;
        totalElectricityUsage: number;
        totalWaste: Record<WasteType, number>;
    };
}

export class SaveCarbonFootprintRecord implements UseCase<SaveCarbonFootprintRecordInput> {
    private readonly _recordRepository: CarbonFootprintRecordRepository;
    private readonly _unitOfWork: UnitOfWork;

    constructor(
        recordRepository: CarbonFootprintRecordRepository,
        unitOfWork: UnitOfWork
    ) {
        this._recordRepository = recordRepository;
        this._unitOfWork = unitOfWork;
    }

    execute(input: SaveCarbonFootprintRecordInput): Promise<void> {
        return this._unitOfWork.do<void>(() => {
            const totalWasteMap = new Map<WasteType, number>(
                Object.entries(input.CarbonFootprint.totalWaste) as [WasteType, number][]
            );

            const carbonFootprint = CarbonFootprint.create(
                input.CarbonFootprint.totalGasUsage,
                input.CarbonFootprint.totalElectricityUsage,
                totalWasteMap
            );

            const record = CarbonFootprintRecord.create(
                CarbonFootprintRecordId.create(input.id),
                UserId.create(input.userId),
                input.month,
                input.year,
                carbonFootprint
            );

            return this._recordRepository.save(record);
        });
    }
}