export type { UnitOfWork } from 'EcoPath/Application/Contracts/Ports/UnitOfWork.ts';

// -- REPOSITORIES --
export type { UserRepository } from 'EcoPath/Domain/Households/UserRepository.ts';
export type { SmartMeterRepository } from 'EcoPath/Domain/Meters/SmartMeterRepository.ts';
export type { WasteScanRepository } from 'EcoPath/Domain/Waste/WasteScanRepository.ts';
export type { CarbonFootprintRecordRepository } from 'EcoPath/Domain/CarbonFootprints/CarbonFootprintRecordRepository.ts';
export type { SensorReadingRepository } from 'EcoPath/Domain/Meters/SensorReadingRepository.ts';
export type { WasteRecordRepository } from 'EcoPath/Domain/Waste/WasteRecordRepository.ts';
export type { PickupRequestRepository } from 'EcoPath/Domain/PickupRequests/PickupRequestRepository.ts';

// -- USECASE INPUT/OUTPUT --
export type { SaveUserInput } from 'EcoPath/Application/Households/SaveUser.ts';
export type { SaveSmartMeterInput } from 'EcoPath/Application/Meters/SaveSmartMeter.ts';
export type { SaveWasteScanInput } from 'EcoPath/Application/Waste/SaveWasteScan.ts';
export type { SavePickupRequestInput } from 'EcoPath/Application/PickupRequests/SavePickupRequest.ts';
export type { ListAllUsersOutput } from 'EcoPath/Application/Households/ListAllUsers.ts';
export type { ListAllSmartMetersOutput } from 'EcoPath/Application/Meters/ListAllSmartMeters.ts';
export type { ListAllWasteScansOutput } from 'EcoPath/Application/Waste/ListAllWasteScans.ts';
export type { ListAllPickupRequestsOutput } from 'EcoPath/Application/PickupRequests/ListAllPickupRequests.ts';

// -- QUERY DATA --
export type { CarbonFootprintRecordData } from 'EcoPath/Application/Contracts/Data/CarbonFootprintRecordData.ts';
export type { SensorReadingRecordData } from 'EcoPath/Application/Contracts/Data/SensorReadingRecordData.ts';

// -- QUERY INTERFACES -- 
export type {
    Interval,
    SensorReadingsBySmartMeterIdOutput, 
    AverageSensorReadingsBySmartMeterIdOutput,
    GroupedAverageSensorReadingsBySmartMeterIdOutput, 
    SensorReadingsBySmartMeterIdAndDateQuery,
    SensorReadingsByCityOutput, 
    AverageSensorReadingsByCityOutput,
    GroupedAverageSensorReadingsByCityOutput, 
    SensorReadingsByCityAndDateQuery,
    CarbonFootprintRecordsByUserIdOutput,
    CarbonFootprintRecordsByUserIdQuery,
} from 'EcoPath/Application/Contracts/Ports/Queries.ts';