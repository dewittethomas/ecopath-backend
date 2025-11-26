import { Guard } from '@domaincrafters/std';

export class GeoLocation {
    private readonly _latitude: number;
    private readonly _longitude: number;

    private constructor(latitude: number, longitude: number) {
        this._latitude = latitude;
        this._longitude = longitude;
    }

    public static create(latitude: number, longitude: number): GeoLocation {
        const geoLocation  = new GeoLocation(latitude, longitude);
        geoLocation.validateState();
        return geoLocation;
    }

    public validateState(): void {
        Guard.check(this._latitude, 'latitude').isInRange(-90, 90);
        Guard.check(this._longitude, 'longitude').isInRange(-180, 180);
    }

    equals(other: GeoLocation): boolean {
        return this._latitude === other.latitude &&
            this._longitude === other.longitude;
    }

    get latitude(): number {
        return this._latitude;
    }

    get longitude(): number {
        return this._longitude;
    }
}