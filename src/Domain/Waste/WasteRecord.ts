import { Guard } from '@domaincrafters/std';
import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { ExtraGuard, UserId, WasteType } from 'EcoPath/Domain/mod.ts';

export class WasteRecordId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): WasteRecordId {
        return new WasteRecordId(id);
    }
}

export class WasteRecord extends Entity {
    private readonly _userId: UserId;
    private readonly _wasteType: WasteType;
    private readonly _weightKg: number;
    private readonly _month: number;
    private readonly _year: number;

    private constructor(
        id: WasteRecordId,
        userId: UserId,
        wasteType: WasteType,
        weightKg: number,
        month: number,
        year: number
    ) {
        super(id);
        this._userId = userId;
        this._wasteType = wasteType;
        this._weightKg = weightKg;
        this._month = month;
        this._year = year;
    }

    public static create(
        id: WasteRecordId,
        userId: UserId,
        wasteType: WasteType,
        weightKg: number,
        year: number,
        month: number
    ): WasteRecord {
        const record = new WasteRecord(id, userId, wasteType, weightKg, month, year);
        record.validateState();
        return record;
    }

    public override validateState(): void {
        Guard.check(this._userId, 'userId').againstNullOrUndefined();

        ExtraGuard.check(this._wasteType, 'wasteType')
            .againstNullOrUndefined()
            .ensureValueExistsInEnum(WasteType);

        Guard.check(this._weightKg, 'weightKg')
            .againstNullOrUndefined()
            .againstNegative();

        Guard.check(this._month, 'month').isInRange(1, 12);
        Guard.check(this._year, 'year').isInRange(2000, 2100);
    }

    override get id(): WasteRecordId {
        return this._id as WasteRecordId;
    }

    get userId(): UserId {
        return this._userId;
    }

    get wasteType(): WasteType {
        return this._wasteType;
    }

    get weightKg(): number {
        return this._weightKg;
    }

    get month(): number {
        return this._month;
    }

    get year(): number {
        return this._year;
    }
}