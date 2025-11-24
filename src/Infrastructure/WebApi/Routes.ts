import type { Router } from '@oak/oak';
import type { RouterBuilder } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import { 
    SaveUserController, 
    SensorReadingsBySmartMeterIdAndDateController, 
    SensorReadingsByCityAndDateController, 
    AllSmartMetersController,
    CarbonFootprintRecordsByUserIdController
} from "EcoPath/Infrastructure/WebApi/mod.ts";

export class Routes {
    static map(routerBuilder: RouterBuilder): Router {
        return routerBuilder
            .mapPost(
                SaveUserController.name,
                '/api/users'
            )
            .mapGet(
                AllSmartMetersController.name,
                '/api/smart-meters'
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