import type { UseCase } from '@domaincrafters/application';
import type { WasteRecordRepository, UnitOfWork } from 'EcoPath/Application/Contracts/mod.ts';
import { WasteRecord, WasteRecordId, UserId, WasteType } from 'EcoPath/Domain/mod.ts';

export interface SaveWasteRecordInput {
    id: string;
    userId: string;
    wasteType: WasteType;
    weightKg: number;
    month: number;
    year: number;
}

export class SaveWasteRecord implements UseCase<SaveWasteRecordInput> {
    private readonly _wasteRecordRepository: WasteRecordRepository;
    private readonly _unitOfWork: UnitOfWork;

    constructor(
        wasteRecordRepository: WasteRecordRepository,
        unitOfWork: UnitOfWork,
    ) {
        this._wasteRecordRepository = wasteRecordRepository;
        this._unitOfWork = unitOfWork;
    }

    execute(input: SaveWasteRecordInput): Promise<void> {
        return this._unitOfWork.do(async () => {
            const record = WasteRecord.create(
                WasteRecordId.create(input.id),
                UserId.create(input.userId),
                input.wasteType,
                input.weightKg,
                input.month,
                input.year
            );

            await this._wasteRecordRepository.save(record);
        });
    }
}