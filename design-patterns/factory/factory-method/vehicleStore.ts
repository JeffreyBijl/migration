import type { Vehicle } from "../vehicles/vehicle.ts";

export abstract class VehicleStore {
  public orderVehicle(): Vehicle {
    const vehicle = this.createVehicle();
    console.log(`Ordering a ${vehicle.getType()}...`);
    console.log(`  Wheels: ${vehicle.getNumberOfWheels()}`);
    console.log(`  Speed: ${vehicle.getSpeed()} km/h`);
    console.log(`  Fuel: ${vehicle.getFuelType()}`);
    return vehicle;
  }

  protected abstract createVehicle(): Vehicle;
}
