import { Guard } from '@domaincrafters/std';
import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { ExtraGuard, UserId, CarbonFootprintData, CarbonFootprintImpact } from 'EcoPath/Domain/mod.ts';

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
    private readonly _carbonFootprintData: CarbonFootprintData;
    private readonly _impact: CarbonFootprintImpact;

    private constructor(
        id: CarbonFootprintRecordId,
        userId: UserId,
        month: number,
        year: number,
        carbonFootprintData: CarbonFootprintData,
        impact: CarbonFootprintImpact
    ) {
        super(id);
        this._userId = userId;
        this._month = month;
        this._year = year;
        this._carbonFootprintData = carbonFootprintData;
        this._impact = impact;
    }

    public static create(
        id: CarbonFootprintRecordId,
        userId: UserId,
        month: number,
        year: number,
        carbonFootprintData: CarbonFootprintData,
        impact: CarbonFootprintImpact
    ): CarbonFootprintRecord {
        const record = new CarbonFootprintRecord(
            id,
            userId,
            month,
            year,
            carbonFootprintData,
            impact
        );

        record.validateState();
        return record;
    }

    public override validateState(): void {
        ExtraGuard.check(this._userId, 'userId').againstNullOrUndefined();
        Guard.check(this._month, 'month').isInRange(1, 12);
        Guard.check(this._year, 'year').isInRange(2000, 2100);
        ExtraGuard.check(this._carbonFootprintData, 'carbonFootprintData').againstNullOrUndefined();
        ExtraGuard.check(this._impact, 'impact').againstNullOrUndefined();
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

    get carbonFootprintData(): CarbonFootprintData {
        return this._carbonFootprintData;
    }

    get impact(): CarbonFootprintImpact {
        return this._impact;
    }
}