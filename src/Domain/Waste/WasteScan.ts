import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { ExtraGuard, WasteType, GeoLocation } from 'EcoPath/Domain/mod.ts';

export class WasteScanId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): WasteScanId {
        return new WasteScanId(id);
    }
}

export class WasteScan extends Entity {
    private readonly _image: string;
    private readonly _timestamp: Date;
    private readonly _wasteType: WasteType;
    private readonly _geoLocation: GeoLocation;

    private constructor(
        id: WasteScanId,
        image: string,
        timestamp: Date,
        wasteType: WasteType,
        geoLocation: GeoLocation
    ) {
        super(id);
        this._image = image;
        this._timestamp = timestamp;
        this._wasteType = wasteType;
        this._geoLocation = geoLocation;
    }

    public static create(
        id: WasteScanId,
        image: string,
        timestamp: Date,
        wasteType: WasteType,
        geoLocation: GeoLocation
    ): WasteScan {
        const scan = new WasteScan(id, image, timestamp, wasteType, geoLocation);
        scan.validateState();
        return scan;
    }

    public override validateState(): void {
        ExtraGuard.check(this._image, 'image')
            .againstNullOrUndefined()
            .ensureStringIsInBase64Format();
        ExtraGuard.check(this._timestamp, 'timestamp')
            .againstNullOrUndefined()
            .ensureIsValidDate();
        ExtraGuard.check(this._wasteType, 'wasteType')
            .againstNullOrUndefined()
            .ensureValueExistsInEnum(WasteType);
        ExtraGuard.check(this._geoLocation, 'geoLocation').againstNullOrUndefined();
    }

    override get id(): WasteScanId {
        return this._id as WasteScanId;
    }

    get image(): string {
        return this._image;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    get wasteType(): WasteType {
        return this._wasteType;
    }

    get geoLocation(): GeoLocation {
        return this._geoLocation;
    }
}