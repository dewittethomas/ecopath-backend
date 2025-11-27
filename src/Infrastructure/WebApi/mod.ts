export type { ControllerFactory } from 'EcoPath/Infrastructure/WebApi/Shared/Contracts/ControllerFactory.ts';

// -- Controllers --

// Save
export { SaveUserController } from 'EcoPath/Infrastructure/WebApi/Controllers/SaveUserController.ts';
export { SaveWasteScanController } from 'EcoPath/Infrastructure/WebApi/Controllers/SaveWasteScanController.ts'; 
export { SavePickupRequestController } from 'EcoPath/Infrastructure/WebApi/Controllers/SavePickupRequestController.ts';

// ById
export { SensorReadingsBySmartMeterIdAndDateController } from 'EcoPath/Infrastructure/WebApi/Controllers/SensorReadingsBySmartMeterIdAndDateController.ts';
export { SensorReadingsByCityAndDateController } from 'EcoPath/Infrastructure/WebApi/Controllers/SensorReadingsByCityAndDateController.ts';
export { CarbonFootprintRecordsByUserIdController } from 'EcoPath/Infrastructure/WebApi/Controllers/CarbonFootprintRecordsByUserIdController.ts';

// All
export { AllWasteScansController } from 'EcoPath/Infrastructure/WebApi/Controllers/AllWasteScansController.ts';
export { AllPickupRequestsController } from "EcoPath/Infrastructure/WebApi/Controllers/AllPickupRequestsController.ts";
export { AllSmartMetersController } from 'EcoPath/Infrastructure/WebApi/Controllers/AllSmartMetersController.ts';