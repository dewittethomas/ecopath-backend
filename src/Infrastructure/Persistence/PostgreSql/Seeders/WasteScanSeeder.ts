import { WasteScanRepository } from "EcoPath/Application/Contracts/mod.ts";
import { GeoLocation, WasteScan, WasteScanId, WasteType } from "EcoPath/Domain/mod.ts";

export class WasteScanSeeder {
    constructor(private readonly wasteScanRepository: WasteScanRepository) {}

    async seed(): Promise<void> {
        const wasteScans = [
            {
                id: WasteScanId.create(),
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUA",
                timestamp: new Date("2025-01-01T00:00:00.000Z"),
                wasteType: WasteType.Plastic,
                geoLocation: {
                    latitude: 37.549431,
                    longitude: 127.074103
                }
            }
        ]

        for (const w of wasteScans) {
            console.log(`Started seeding WasteScan (Latitude: ${w.geoLocation.latitude} Longitude: ${w.geoLocation.longitude})`);
            const wasteScan = WasteScan.create(
                w.id, 
                w.image,
                w.timestamp,
                w.wasteType,
                w.geoLocation as GeoLocation
            )
            await this.wasteScanRepository.save(wasteScan);
        }
        console.log(`Seeded WasteScans (${wasteScans.length})`);
    }
}