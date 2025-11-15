import type { Router } from '@oak/oak';
import type { RouterBuilder } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import { SaveUserController, AllSensorReadingsBySmartMeterIdAndDateController, AllSmartMetersController } from "EcoPath/Infrastructure/WebApi/mod.ts";

export class Routes {
    static map(routerBuilder: RouterBuilder): Router {
        return routerBuilder
            .mapPost(
                SaveUserController.name,
                '/api/users'
            )
            .mapGet(
                AllSensorReadingsBySmartMeterIdAndDateController.name,
                '/api/smart-meters/:smartMeterId/readings'
            )
            .mapGet(
                AllSmartMetersController.name,
                '/api/smart-meters'
            )
            .build();
    }
}
