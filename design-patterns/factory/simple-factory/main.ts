import { VehicleFactory } from "./vehicleFactory.ts";

const factory = new VehicleFactory();

const vehicleTypes = ["car", "motorcycle", "bicycle"];

for (const type of vehicleTypes) {
  const vehicle = factory.createVehicle(type);
  console.log(`${vehicle.getType()} — ${vehicle.getNumberOfWheels()} wheels, ${vehicle.getSpeed()} km/h, ${vehicle.getFuelType()}`);
}
