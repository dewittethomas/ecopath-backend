import { assertEquals, assertThrows } from '@std/assert';
import {
    CarbonFootprint,
    WasteType,
    WasteCarbonFactors
} from 'EcoPath/Domain/mod.ts';

function makeValidWasteData(): Map<WasteType, number> {
    return new Map([
        [WasteType.Glass, 0],
        [WasteType.Plastic, 10],
        [WasteType.Metal, 2],
        [WasteType.PaperAndCardboard, 5],
        [WasteType.GeneralWaste, 0],
        [WasteType.BioWaste, 0],
    ]);
}

function makeValidCarbonFootprint(): CarbonFootprint {
    return CarbonFootprint.create(100, 200, makeValidWasteData());
}

Deno.test('CarbonFootprint - Creates successfully', () => {
    const footprint = makeValidCarbonFootprint();

    assertEquals(footprint.totalGasUsage, 100);
    assertEquals(footprint.totalElectricityUsage, 200);
    assertEquals(footprint.totalWaste.get(WasteType.Glass), 0);
    assertEquals(footprint.totalWaste.get(WasteType.Plastic), 10);
    assertEquals(footprint.totalWaste.get(WasteType.Metal), 2);
    assertEquals(footprint.totalWaste.get(WasteType.PaperAndCardboard), 5);
});

Deno.test('CarbonFootprint - Fails on invalid or negative values', async (t) => {
    const validWaste = makeValidWasteData();

    const invalidCases = [
        { gas: -1, electricity: 200, waste: validWaste, msg: 'negative gas usage' },
        { gas: 100, electricity: -50, waste: validWaste, msg: 'negative electricity usage' },
        {
            gas: 100,
            electricity: 200,
            waste: new Map([[WasteType.PaperAndCardboard, -10]]),
            msg: 'negative waste weight'
        },
    ];

    for (const c of invalidCases) {
        await t.step(`Throws with ${c.msg}`, () => {
            assertThrows(() => {
                CarbonFootprint.create(c.gas, c.electricity, c.waste);
            });
        });
    }
});

Deno.test('CarbonFootprint - Calculates carbon equivalent correctly', () => {
    const waste = new Map<WasteType, number>([
        [WasteType.Plastic, 10],
        [WasteType.PaperAndCardboard, 5],
        [WasteType.Glass, 0]
    ]);

    const footprint = CarbonFootprint.create(50, 100, waste);

    const expected =
        (50 * 2.2) +
        (100 * 0.55) +
        (10 * WasteCarbonFactors[WasteType.Plastic]) +
        (5 * WasteCarbonFactors[WasteType.PaperAndCardboard]);

    assertEquals(footprint.calculateCarbonEquivalent(), expected);
});

Deno.test('CarbonFootprint - Handles unknown waste types gracefully', () => {
    const waste = new Map<WasteType, number>([
        ['UNKNOWN' as WasteType, 10],
        [WasteType.Glass, 3]
    ]);

    const footprint = CarbonFootprint.create(0, 0, waste);
    const result = footprint.calculateCarbonEquivalent();

    assertEquals(result >= 0, true);
    assertEquals(typeof result, 'number');
});