import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { Guard } from '@domaincrafters/std';
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
    private readonly _year: number;
    private readonly _month: number;

    private constructor(
        id: WasteRecordId,
        userId: UserId,
        wasteType: WasteType,
        weightKg: number,
        year: number,
        month: number,
    ) {
        super(id);
        this._userId = userId;
        this._wasteType = wasteType;
        this._weightKg = weightKg;
        this._year = year;
        this._month = month;
    }

    public static create(
        id: WasteRecordId,
        userId: UserId,
        wasteType: WasteType,
        weightKg: number,
        year: number,
        month: number,
    ): WasteRecord {
        const record = new WasteRecord(id, userId, wasteType, weightKg, year, month);
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

        ExtraGuard.check(this._year, 'year')
            .againstNullOrUndefined()
            .ensureNumberIsBetween(2000, 2100);

        ExtraGuard.check(this._month, 'month')
            .againstNullOrUndefined()
            .ensureNumberIsBetween(1, 12);
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

    get year(): number {
        return this._year;
    }

    get month(): number {
        return this._month;
    }
}
