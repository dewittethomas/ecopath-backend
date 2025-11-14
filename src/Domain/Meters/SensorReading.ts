import { Guard } from '@domaincrafters/std';
import { ExtraGuard, SmartMeterId } from 'EcoPath/Domain/mod.ts';

export enum Unit {
  KilowattHour = 'kilowatt_hour',
  CubicMeter = 'cubic_meter',
}

export class SensorReading {
    private readonly _smartMeterId: SmartMeterId;
    private readonly _timestamp: Date;
    private readonly _value: number;
    private readonly _unit: Unit;

    private constructor(
        smartMeterId: SmartMeterId,
        timestamp: Date,
        value: number,
        unit: Unit,
    ) {
        this._smartMeterId = smartMeterId;
        this._timestamp = timestamp;
        this._value = value;
        this._unit = unit;
    }

    public static create(
        smartMeterId: SmartMeterId,
        timestamp: Date,
        value: number,
        unit: Unit,
    ): SensorReading {
        const sensorReading: SensorReading = new SensorReading(smartMeterId, timestamp, value, unit);
        sensorReading.validateState();
        return sensorReading;
    }

    public validateState(): void {
        ExtraGuard.check(this._smartMeterId, 'smartMeterId').againstNullOrUndefined();
        ExtraGuard.check(this._timestamp, 'timestamp').againstNullOrUndefined().ensureIsValidDate().ensureDateIsInThePast();
        Guard.check(this._value, 'value').againstNegative();
        ExtraGuard.check(this._unit, 'unit').againstNullOrUndefined().ensureValueExistsInEnum(Unit);
    }

    equals(other: SensorReading): boolean {
        return this.smartMeterId.equals(other.smartMeterId) && 
                this.timestamp.getTime() === other.timestamp.getTime() &&
                this.value === other.value && 
                this.unit === other.unit; 
    }

    get smartMeterId(): SmartMeterId {
        return this._smartMeterId;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    get value(): number {
        return this._value;
    }

    get unit(): Unit {
        return this._unit;
    }
}