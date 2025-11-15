import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { Guard } from '@domaincrafters/std';
import { ExtraGuard, UserId, WasteType } from "EcoPath/Domain/mod.ts";

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
    private readonly _disposedAt: Date;

    private constructor(
        id: WasteRecordId,
        userId: UserId,
        wasteType: WasteType,
        weightKg: number,
        disposedAt: Date,
    ) {
        super(id);
        this._userId = userId;
        this._wasteType = wasteType;
        this._weightKg = weightKg;
        this._disposedAt = disposedAt;
    }

    public static create(
        id: WasteRecordId,
        userId: UserId,
        wasteType: WasteType,
        weightKg: number,
        disposedAt: Date,
    ): WasteRecord {
        const record = new WasteRecord(id, userId, wasteType, weightKg, disposedAt);
        record.validateState();
        return record;
    }

    public override validateState(): void {
        Guard.check(this._userId, 'userId').againstNullOrUndefined();
        ExtraGuard.check(this._wasteType, 'wasteType').againstNullOrUndefined().ensureValueExistsInEnum(WasteType);
        Guard.check(this._weightKg, 'weightKg').againstNullOrUndefined().againstNegative();
        ExtraGuard.check(this._disposedAt, 'disposedAt').againstNullOrUndefined().ensureIsValidDate().ensureDateIsInThePast();
    }

    override get id(): WasteRecordId {
        return this._id as WasteRecordId;
    }

    get userId(): UserId {
        return this._userId;
    }

    get wasteType(): string {
        return this._wasteType;
    }

    get weightKg(): number {
        return this._weightKg;
    }

    get disposedAt(): Date {
        return this._disposedAt;
    }
}