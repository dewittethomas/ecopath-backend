import { PickupRequestRepository } from "EcoPath/Application/Contracts/mod.ts";
import { PickupRequest, PickupRequestId, Location } from "EcoPath/Domain/mod.ts";

export class PickupRequestSeeder {
    constructor(private readonly pickupRequestRepository: PickupRequestRepository) {}

    async seed(): Promise<void> {
        const pickupRequests = [
            {
                id: PickupRequestId.create(),
                location: {
                    houseNumber: '11',
                    street: 'Main St',
                    city: 'Daejeon',
                    postalCode: '1000'
                },
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUA",
                timestamp: new Date("2025-12-04T10:00:00.000Z"),
                notes: ''
            },
            {
                id: PickupRequestId.create(),
                location: {
                    houseNumber: '11',
                    street: '2nd St',
                    city: 'Busan',
                    postalCode: '1000'
                },
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUB",
                timestamp: new Date("2025-12-03T12:00:00.000Z"),
                notes: ''
            },
            {
                id: PickupRequestId.create(),
                location: {
                    houseNumber: '11',
                    street: '3nd St',
                    city: 'Daejeon',
                    postalCode: '1000'
                },
                image: "iVBORw0KGgoAAAANSUhEUgAAAAUD",
                timestamp: new Date("2025-12-05T14:00:00.000Z"),
                notes: 'Very heavy'
            },
        ]

        for (const p of pickupRequests) {
            console.log(`Started seeding PickupRequest (City: ${p.location.city})`);
            const location = Location.create(
                p.location.houseNumber,
                p.location.street,
                p.location.city,
                p.location.postalCode
            )

            const pickupRequest = PickupRequest.create(
                p.id,
                location,
                p.image,
                p.timestamp,
                p.notes
            )

            await this.pickupRequestRepository.save(pickupRequest);
        }
        console.log(`Seeded PickupRequests (${pickupRequests.length})`);
    }
}