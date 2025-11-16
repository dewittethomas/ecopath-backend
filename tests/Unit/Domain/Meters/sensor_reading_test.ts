import { assertEquals, assertThrows } from '@std/assert';
import { SensorReading, Unit, SmartMeterId } from 'EcoPath/Domain/mod.ts';

function makeValidSensorReadingData() {
    return {
        smartMeterId: SmartMeterId.create(),
        timestamp: new Date(2000, 1, 1),
        value: 10,
        unit: Unit.CubicMeter
    }
}

Deno.test('SensorReading - Create successfully', () => {
    const data = makeValidSensorReadingData();
    const reading = SensorReading.create(data.smartMeterId, data.timestamp, data.value, data.unit);

    assertEquals(reading.smartMeterId.equals(data.smartMeterId), true);
    assertEquals(reading.timestamp.getTime(), data.timestamp.getTime());
    assertEquals(reading.value, data.value);
    assertEquals(reading.unit, data.unit);
});

Deno.test('SensorReading - Fails with invalid or missing fields', async (t) => {
    const smartMeterId = SmartMeterId.create();
    const timestamp = new Date();

    const invalidCases = [
        { smartMeterId: null as unknown as SmartMeterId, timestamp, value: 10, unit: Unit.KilowattHour, msg: 'missing SmartMeter' },

        { smartMeterId, timestamp: null as unknown as Date, value: 10, unit: Unit.KilowattHour, msg: 'missing timestamp' },
        { smartMeterId, timestamp, value: -5, unit: Unit.KilowattHour, msg: 'negative value' },
        { smartMeterId, timestamp, value: 10, unit: null as unknown as Unit, msg: 'missing unit' },
        { smartMeterId, timestamp: new Date(Date.now() + 60_000), value: 10, unit: Unit.KilowattHour, msg: 'future timestamp' },
        { smartMeterId, timestamp, value: 10, unit: 'invalid' as unknown as Unit, msg: 'invalid enum unit' }
    ];

    for (const c of invalidCases) {
        await t.step(`Throws with ${c.msg}`, () => {
            assertThrows(() => {
                SensorReading.create(c.smartMeterId, c.timestamp, c.value, c.unit);
            });
        });
    }
});

Deno.test('SensorReading - Equals method compares correctly', () => {
    const smartMeterId = SmartMeterId.create();
    const timestamp = new Date(2000, 1, 1);

    const reading1 = SensorReading.create(smartMeterId, timestamp, 50, Unit.CubicMeter);
    const reading2 = SensorReading.create(smartMeterId, new Date(2000, 1, 1), 50, Unit.CubicMeter);
    const reading3 = SensorReading.create(smartMeterId, timestamp, 25, Unit.CubicMeter);

    assertEquals(reading1.equals(reading2), true);
    assertEquals(reading1.equals(reading3), false);
});
