import type { UseCase } from '@domaincrafters/application';
import type { CarbonFootprintRecordRepository, UnitOfWork } from 'EcoPath/Application/Contracts/mod.ts';
import {
    CarbonFootprintRecord,
    CarbonFootprintRecordId,
    CarbonFootprintData,
    WasteType,
    UserId,
    CarbonFootprintImpact
} from 'EcoPath/Domain/mod.ts';

export interface SaveCarbonFootprintRecordInput {
    userId: string;
    year: number;
    month: number;
    carbonFootprintData: {
        gasM3: number;
        electricityKWh: number;
        wasteKg: Map<string, number>
    };
    impact: number;
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
            const wasteMap = new Map<WasteType, number>(
                Object.entries(input.carbonFootprintData.wasteKg) as [WasteType, number][]
            );

            const carbonFootprintData = CarbonFootprintData.create(
                input.carbonFootprintData.gasM3,
                input.carbonFootprintData.electricityKWh,
                wasteMap
            );

            const carbonFootprintImpact = CarbonFootprintImpact.create(input.impact);

            const carbonFootprintRecordId = CarbonFootprintRecordId.create();

            const record = CarbonFootprintRecord.create(
                carbonFootprintRecordId,
                UserId.create(input.userId),
                input.month,
                input.year,
                carbonFootprintData,
                carbonFootprintImpact
            );

            return this._recordRepository.save(record);
        });
    }
}