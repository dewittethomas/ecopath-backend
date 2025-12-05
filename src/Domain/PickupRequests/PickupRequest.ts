import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { ExtraGuard, Location } from "EcoPath/Domain/mod.ts";

export class PickupRequestId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): PickupRequestId {
        return new PickupRequestId(id);
    }
}

export class PickupRequest extends Entity {
    private readonly _location: Location;
    private readonly _image: string;
    private readonly _timestamp: Date;
    private readonly _notes?: string;

    private constructor(
        id: PickupRequestId,
        location: Location,
        image: string,
        timestamp: Date,
        notes?: string
    ) {
        super(id);
        this._location = location;
        this._image = image;
        this._timestamp = timestamp;
        this._notes = notes;
    }

    public static create(
        id: PickupRequestId,
        location: Location,
        image: string,
        timestamp: Date,
        notes?: string
    ): PickupRequest {
        const pickupRequest = new PickupRequest(id, location, image, timestamp, notes);
        pickupRequest.validateState();
        return pickupRequest;
    }

    public override validateState(): void {
        ExtraGuard.check(this._location, 'location').againstNullOrUndefined();
        ExtraGuard.check(this._image, 'image').againstNullOrUndefined();
        ExtraGuard.check(this._timestamp, 'timestamp').againstNullOrUndefined();
    }

    override get id(): PickupRequestId {
        return this._id as PickupRequestId;
    }

    get location(): Location {
        return this._location;
    }

    get image(): string {
        return this._image;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    get notes(): string | undefined {
        return this._notes;
    }
}