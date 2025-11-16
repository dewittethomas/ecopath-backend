import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { Guard } from '@domaincrafters/std';
import { ExtraGuard, UserId } from 'EcoPath/Domain/mod.ts';

export class WasteScanId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): WasteScanId {
        return new WasteScanId(id);
    }
}

export class WasteScan extends Entity {
    private readonly _userId: UserId;
    private readonly _timestamp: Date;
    private readonly _image: string;

    private constructor(
        id: WasteScanId,
        userId: UserId,
        timestamp: Date,
        image: string,
    ) {
        super(id);
        this._userId = userId;
        this._timestamp = timestamp;
        this._image = image;
    }

    public static create(
        id: WasteScanId,
        userId: UserId,
        timestamp: Date,
        image: string,
    ): WasteScan {
        const scan = new WasteScan(id, userId, timestamp, image);
        scan.validateState();
        return scan;
    }

    public override validateState(): void {
        Guard.check(this._userId, 'userId').againstNullOrUndefined();
        ExtraGuard.check(this._timestamp, 'timestamp')
            .againstNullOrUndefined()
            .ensureIsValidDate()
            .ensureDateIsInThePast();
        ExtraGuard.check(this._image, 'image')
            .againstNullOrUndefined()
            .ensureStringIsInBase64Format();
    }

    override get id(): WasteScanId {
        return this._id as WasteScanId;
    }

    get userId(): UserId {
        return this._userId;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    get image(): string {
        return this._image;
    }
}