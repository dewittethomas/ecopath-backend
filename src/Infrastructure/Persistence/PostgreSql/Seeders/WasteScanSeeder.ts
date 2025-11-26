import { WasteScanRepository } from "EcoPath/Application/Contracts/mod.ts";
import { GeoLocation, WasteScan, WasteScanId, WasteType } from "EcoPath/Domain/mod.ts";

export class WasteScanSeeder {
    constructor(private readonly wasteScanRepository: WasteScanRepository) {}

    async seed(): Promise<void> {
        const wasteScans = [
            {
                id: WasteScanId.create(),
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUA",
                timestamp: new Date("2025-01-01T10:00:00.000Z"),
                wasteType: WasteType.Plastic,
                geoLocation: { latitude: 37.5665, longitude: 126.978 }
            },
            {
                id: WasteScanId.create(),
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUB",
                timestamp: new Date("2025-01-01T12:30:00.000Z"),
                wasteType: WasteType.Metal,
                geoLocation: { latitude: 37.5796, longitude: 126.977 }
            },
            {
                id: WasteScanId.create(),
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUC",
                timestamp: new Date("2025-01-01T15:45:00.000Z"),
                wasteType: WasteType.PaperAndCardboard,
                geoLocation: { latitude: 37.57, longitude: 127.009 }
            },
            {
                id: WasteScanId.create(),
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUD",
                timestamp: new Date("2025-01-01T17:20:00.000Z"),
                wasteType: WasteType.Plastic,
                geoLocation: { latitude: 37.5512, longitude: 126.9882 }
            },
            {
                id: WasteScanId.create(),
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUE",
                timestamp: new Date("2025-01-01T20:10:00.000Z"),
                wasteType: WasteType.Glass,
                geoLocation: { latitude: 37.5651, longitude: 126.9895 }
            }
        ]

        for (const w of wasteScans) {
            console.log(`Started seeding WasteScan (Latitude: ${w.geoLocation.latitude} Longitude: ${w.geoLocation.longitude})`);
            const wasteScan = WasteScan.create(
                w.id, 
                w.image,
                w.timestamp,
                w.wasteType,
                GeoLocation.create(
                    w.geoLocation.latitude,
                    w.geoLocation.longitude
                )
            )
            await this.wasteScanRepository.save(wasteScan);
        }
        console.log(`Seeded WasteScans (${wasteScans.length})`);
    }
}