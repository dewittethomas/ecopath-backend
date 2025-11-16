import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { ExtraGuard, UserId, CarbonFootprint } from 'EcoPath/Domain/mod.ts';

export class CarbonFootprintRecordId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): CarbonFootprintRecordId {
        return new CarbonFootprintRecordId(id);
    }
}

export class CarbonFootprintRecord extends Entity {
    private readonly _userId: UserId;
    private readonly _year: number;
    private readonly _month: number;
    private readonly _carbonFootprint: CarbonFootprint;

    private constructor(
        id: CarbonFootprintRecordId,
        userId: UserId,
        month: number,
        year: number,
        carbonFootprint: CarbonFootprint
    ) {
        super(id);
        this._userId = userId;
        this._month = month;
        this._year = year;
        this._carbonFootprint = carbonFootprint;
    }

    public static create(
        id: CarbonFootprintRecordId,
        userId: UserId,
        month: number,
        year: number,
        carbonFootprint: CarbonFootprint
    ): CarbonFootprintRecord {
        const record = new CarbonFootprintRecord(
            id,
            userId,
            month,
            year,
            carbonFootprint
        );

        record.validateState();
        return record;
    }

    public override validateState(): void {
        ExtraGuard.check(this._userId, 'userId').againstNullOrUndefined();

        ExtraGuard.check(this._month, 'month')
            .againstNullOrUndefined()
            .ensureNumberIsBetween(1, 12);

        ExtraGuard.check(this._year, 'year')
            .againstNullOrUndefined()
            .ensureNumberIsBetween(2000, 2100);

        ExtraGuard.check(this._carbonFootprint, 'carbonFootprint').againstNullOrUndefined();
    }

    override get id(): CarbonFootprintRecordId {
        return this._id as CarbonFootprintRecordId;
    }

    get userId(): UserId {
        return this._userId;
    }

    get month(): number {
        return this._month;
    }

    get year(): number {
        return this._year;
    }

    get carbonFootprint(): CarbonFootprint {
        return this._carbonFootprint;
    }
}