import { IllegalStateException } from '@domaincrafters/std';
import type { RouterContext } from '@oak/oak';
import type { WebApiController } from 'EcoPath/Infrastructure/WebApi/Shared/WebApiController.ts';
import type { ControllerFactory } from 'EcoPath/Infrastructure/WebApi/Shared/mod.ts';
import {
    SaveUserController,
    SavePickupRequestController,
    AllSmartMetersController,
    AllWasteScansController,
    AllPickupRequestsController,
    SensorReadingsBySmartMeterIdAndDateController,
    SensorReadingsByCityAndDateController,
    CarbonFootprintRecordsByUserIdController,
    SaveWasteScanController,
    GetWasteScanImageByIdController,
    GetPickupRequestImageByIdController
} from 'EcoPath/Infrastructure/WebApi/mod.ts';
import {
    SavePickupRequest,
    ListAllWasteScans,
    ListAllSmartMeters,
    ListAllPickupRequests,
    SaveUser,
    SaveWasteScan,
    GetWasteScanImageById,
    GetPickupRequestImageById
} from 'EcoPath/Application/mod.ts';
import {
    SensorReadingsBySmartMeterIdAndDateQuery,
    SensorReadingsByCityAndDateQuery,
    CarbonFootprintRecordsByUserIdQuery,
    SmartMeterRepository,
    WasteScanRepository,
    PickupRequestRepository
} from 'EcoPath/Application/Contracts/mod.ts';
import type { ServiceProvider } from '@domaincrafters/di';
import type {
    UserRepository,
    UnitOfWork
} from 'EcoPath/Application/Contracts/mod.ts';

export class OakControllerFactory implements ControllerFactory {
    private readonly _serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
    }

    async create(
        ctx: RouterContext<string>,
    ): Promise<WebApiController> {
        if (!ctx.routeName) {
            throw new IllegalStateException('Route name not found');
        }

        switch (ctx.routeName) {
            case AllSmartMetersController.name:
                return await this.buildAllSmartMetersController();
            case SaveUserController.name:
                return await this.buildSaveUserController();
            case SaveWasteScanController.name:
                return await this.buildSaveWasteScanController();
            case SavePickupRequestController.name:
                return await this.buildSavePickupRequestController();
            case AllWasteScansController.name:
                return await this.buildAllWasteScansController();
            case AllPickupRequestsController.name:
                return await this.buildAllPickupRequestsController();
            case SensorReadingsBySmartMeterIdAndDateController.name:
                return await this.buildSensorReadingsBySmartMeterIdAndDateController();
            case SensorReadingsByCityAndDateController.name:
                return await this.buildSensorReadingsByCityAndDateController();
            case CarbonFootprintRecordsByUserIdController.name:
                return await this.buildCarbonFootprintRecordsByUserIdController();
            case GetWasteScanImageByIdController.name:
                return await this.buildGetWasteScanImageByIdController();
            case GetPickupRequestImageByIdController.name:
                return await this.buildGetPickupRequestImageByIdController();
            default:
                throw new IllegalStateException(`Route name ${ctx.routeName} not found`);
        }
    }

    private async buildSaveUserController(): Promise<SaveUserController> {
        const userRepository = (await this._serviceProvider.getService<UserRepository>(
            'postgreSqlUserRepository',
        )).getOrThrow();

        const unitOfWork = (await this._serviceProvider.getService<UnitOfWork>('postgreSqlUnitOfWork'))
            .getOrThrow();

        const saveUser: SaveUser = new SaveUser(
            userRepository,
            unitOfWork
        );

        return new SaveUserController(
            saveUser
        );
    }

    private async buildSaveWasteScanController(): Promise<SaveWasteScanController> {
        const wasteScanRepository = (await this._serviceProvider.getService<WasteScanRepository>(
            'postgreSqlWasteScanRepository'
        )).getOrThrow();

        const unitOfWork = (await this._serviceProvider.getService<UnitOfWork>('postgreSqlUnitOfWork'))
            .getOrThrow();

        const saveWasteScan: SaveWasteScan = new SaveWasteScan(
            wasteScanRepository,
            unitOfWork
        );

        return new SaveWasteScanController(
            saveWasteScan
        );
    }

    private async buildSavePickupRequestController(): Promise<SavePickupRequestController> {
        const pickupRequestRepository = (await this._serviceProvider.getService<PickupRequestRepository>(
            'postgreSqlPickupRequestRepository'
        )).getOrThrow();

        const unitOfWork = (await this._serviceProvider.getService<UnitOfWork>('postgreSqlUnitOfWork'))
            .getOrThrow();

        const savePickupRequest: SavePickupRequest = new SavePickupRequest(
            pickupRequestRepository,
            unitOfWork
        );

        return new SavePickupRequestController(
            savePickupRequest
        );
    }

    private async buildAllSmartMetersController(): Promise<AllSmartMetersController> {
        const smartMeterRepository = (await this._serviceProvider.getService<SmartMeterRepository>(
            'postgreSqlSmartMeterRepository'
        )).getOrThrow();

        const listAllSmartMeters = new ListAllSmartMeters(smartMeterRepository);

        return new AllSmartMetersController(listAllSmartMeters);
    }

    private async buildAllWasteScansController(): Promise<AllWasteScansController> {
        const wasteScanRepository = (await this._serviceProvider.getService<WasteScanRepository>(
            'postgreSqlWasteScanRepository'
        )).getOrThrow();

        const listAllWasteScans = new ListAllWasteScans(wasteScanRepository);

        return new AllWasteScansController(listAllWasteScans);
    }

    private async buildAllPickupRequestsController(): Promise<AllPickupRequestsController> {
        const pickupRequestRepository = (await this._serviceProvider.getService<PickupRequestRepository>(
            'postgreSqlPickupRequestRepository'
        )).getOrThrow();

        const listAllPickupRequests = new ListAllPickupRequests(pickupRequestRepository);

        return new AllPickupRequestsController(listAllPickupRequests);
    }

    private async buildSensorReadingsBySmartMeterIdAndDateController(): Promise<SensorReadingsBySmartMeterIdAndDateController> {
        const query = (await this._serviceProvider.getService<SensorReadingsBySmartMeterIdAndDateQuery>(
            'sensorReadingsBySmartMeterIdAndDateQuery'
        )).getOrThrow();

        return new SensorReadingsBySmartMeterIdAndDateController(query);
    }

    private async buildSensorReadingsByCityAndDateController(): Promise<SensorReadingsByCityAndDateController> {
        const query = (await this._serviceProvider.getService<SensorReadingsByCityAndDateQuery>(
            'sensorReadingsByCityAndDateQuery'
        )).getOrThrow();

        return new SensorReadingsByCityAndDateController(query);
    }

    private async buildCarbonFootprintRecordsByUserIdController(): Promise<CarbonFootprintRecordsByUserIdController> {
        const query = (await this._serviceProvider.getService<CarbonFootprintRecordsByUserIdQuery>(
            'carbonFootprintRecordsByUserIdQuery'
        )).getOrThrow();

        return new CarbonFootprintRecordsByUserIdController(query);
    }

    private async buildGetWasteScanImageByIdController(): Promise<GetWasteScanImageByIdController> {
        const wasteScanRepository = (await this._serviceProvider.getService<WasteScanRepository>(
            'postgreSqlWasteScanRepository'
        )).getOrThrow();

        const getWasteScanImageById = new GetWasteScanImageById(wasteScanRepository);

        return new GetWasteScanImageByIdController(getWasteScanImageById);
    }

    private async buildGetPickupRequestImageByIdController(): Promise<GetPickupRequestImageByIdController> {
        const pickupRequestRepository = (await this._serviceProvider.getService<PickupRequestRepository>(
            'postgreSqlPickupRequestRepository'
        )).getOrThrow();

        const getPickupRequestImageById = new GetPickupRequestImageById(pickupRequestRepository);

        return new GetPickupRequestImageByIdController(getPickupRequestImageById);
    }
}