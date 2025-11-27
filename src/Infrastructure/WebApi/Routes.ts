import type { Router } from '@oak/oak';
import type { RouterBuilder } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import { 
    SaveUserController,
    SaveWasteScanController,
    SavePickupRequestController,
    SensorReadingsBySmartMeterIdAndDateController, 
    SensorReadingsByCityAndDateController, 
    AllSmartMetersController,
    AllWasteScansController,
    CarbonFootprintRecordsByUserIdController,
    AllPickupRequestsController
} from "EcoPath/Infrastructure/WebApi/mod.ts";

export class Routes {
    static map(routerBuilder: RouterBuilder): Router {
        return routerBuilder
            .mapPost(
                SaveUserController.name,
                '/api/users'
            )
            .mapPost(
                SaveWasteScanController.name,
                '/api/waste-scans'
            )
            .mapPost(
                SavePickupRequestController.name,
                '/api/pickup-requests'
            )
            .mapGet(
                AllSmartMetersController.name,
                '/api/smart-meters'
            )
            .mapGet(
                AllWasteScansController.name,
                '/api/waste-scans'
            )
            .mapGet(
                AllPickupRequestsController.name,
                '/api/pickup-requests'
            )
            .mapGet(
                SensorReadingsBySmartMeterIdAndDateController.name,
                '/api/smart-meters/:smartMeterId/readings'
            )
            .mapGet(
                SensorReadingsByCityAndDateController.name,
                '/api/smart-meters/:city/readings/:type'
            )
            .mapGet(
                CarbonFootprintRecordsByUserIdController.name,
                '/api/carbon-footprint-records/:userId'
            )
            .build();
    }
}