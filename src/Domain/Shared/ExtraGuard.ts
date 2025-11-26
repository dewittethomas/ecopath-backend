import { Guard } from "@domaincrafters/std";

export class ExtraGuard<T> {
    private readonly value: T;
    private readonly parameterName: string;

    constructor(
        value: T,
        parameterName: string
    ) {
        this.value = value;
        this.parameterName = parameterName;
    }

    static check<T>(value: T, parameterName?: string): ExtraGuard<T> {
        return new ExtraGuard(value, parameterName || 'value');
    }

    private throwException(message: string): never {
        throw new Error(`${message} Actual value: ${JSON.stringify(this.value)}`)
    }

    public againstNullOrUndefined(message?: string): this {
        Guard.check(this.value, message).againstNullOrUndefined();
        return this;
    }

    public ensureIsValidDate(message?: string): this {
        if (!(this.value instanceof Date)) {
            this.throwException(message || 'Expected a Date instance.');
        }
        return this;
    }

    public ensureDateIsInThePast(message?: string): this {
        if (this.value > new Date()) {
            this.throwException(message || 'Date should be in the past.');
        }
        return this;
    }

    public ensureDateIsInTheFuture(message?: string): this {
        if (this.value < new Date()) {
            this.throwException(message || 'Date should be in the future.');
        }
        return this;
    }

    public ensureValueExistsInEnum<E extends Record<string, unknown>>(enumType: E, message?: string): this {
        if (!Object.values(enumType).includes(this.value)) {
            this.throwException(message || `Invalid enum value "${this.value}" — not part of ${enumType.constructor.name}.`);
        }
        return this;
    }

    public ensureNumberIsAboveZero(message?: string) {
        Guard.check(this.value, message).againstZero().againstNegative();
    }

    public ensureStringIsInBase64Format(message?: string) {
        Guard.check(this.value, message).matches(/^[A-Za-z0-9+/=]+$/);
        return this;
    }
} 