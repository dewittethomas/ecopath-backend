import { assertEquals, assertThrows } from '@std/assert';
import {
    CarbonFootprintRecord,
    CarbonFootprintRecordId,
    CarbonFootprint,
    UserId,
    WasteType
} from 'EcoPath/Domain/mod.ts';

function makeValidCarbonFootprint(): CarbonFootprint {
    const totalWaste = new Map<WasteType, number>([
        [WasteType.Glass, 0],
        [WasteType.Plastic, 10],
        [WasteType.Metal, 2],
        [WasteType.PaperAndCardboard, 5],
        [WasteType.GeneralWaste, 0],
        [WasteType.BioWaste, 0],
    ]);

    return CarbonFootprint.create(50, 100, totalWaste);
}

function makeValidCarbonFootprintRecordData() {
    return {
        id: CarbonFootprintRecordId.create(),
        userId: UserId.create(),
        month: 1,
        year: 2023,
        carbonFootprint: makeValidCarbonFootprint()
    };
}

Deno.test('CarbonFootprintRecord - Creates successfully', () => {
    const data = makeValidCarbonFootprintRecordData();

    const record = CarbonFootprintRecord.create(
        data.id,
        data.userId,
        data.month,
        data.year,
        data.carbonFootprint
    );

    assertEquals(record.id.equals(data.id), true);
    assertEquals(record.userId.equals(data.userId), true);
    assertEquals(record.month, data.month);
    assertEquals(record.year, data.year);
});

Deno.test('CarbonFootprintRecord - Fails with missing or invalid data', async (t) => {
    const valid = makeValidCarbonFootprintRecordData();

    const invalidCases = [
        {
            userId: null as unknown as UserId,
            month: valid.month,
            year: valid.year,
            carbonFootprint: valid.carbonFootprint,
            msg: 'missing userId'
        },
        {
            userId: valid.userId,
            month: 0,
            year: valid.year,
            carbonFootprint: valid.carbonFootprint,
            msg: 'invalid month too low'
        },
        {
            userId: valid.userId,
            month: 13,
            year: valid.year,
            carbonFootprint: valid.carbonFootprint,
            msg: 'invalid month too high'
        },
        {
            userId: valid.userId,
            month: valid.month,
            year: 1500,
            carbonFootprint: valid.carbonFootprint,
            msg: 'invalid year too low'
        },
        {
            userId: valid.userId,
            month: valid.month,
            year: 9999,
            carbonFootprint: valid.carbonFootprint,
            msg: 'invalid year too high'
        },
        {
            userId: valid.userId,
            month: valid.month,
            year: valid.year,
            carbonFootprint: null as unknown as CarbonFootprint,
            msg: 'missing carbonFootprint'
        }
    ];

    for (const c of invalidCases) {
        await t.step(`Throws with ${c.msg}`, () => {
            assertThrows(() => {
                CarbonFootprintRecord.create(
                    valid.id,
                    c.userId,
                    c.month,
                    c.year,
                    c.carbonFootprint
                );
            });
        });
    }
});

Deno.test('CarbonFootprintRecord - Correctly references CarbonFootprint values', () => {
    const data = makeValidCarbonFootprintRecordData();
    const record = CarbonFootprintRecord.create(
        data.id,
        data.userId,
        data.month,
        data.year,
        data.carbonFootprint
    );

    assertEquals(record.carbonFootprint.totalGasUsage, data.carbonFootprint.totalGasUsage);
    assertEquals(record.carbonFootprint.totalElectricityUsage, data.carbonFootprint.totalElectricityUsage);
    assertEquals(record.carbonFootprint.totalWaste.get(WasteType.Plastic), 10);
});