import { VehicleStore } from "./vehicleStore.ts";
import type { Vehicle } from "../vehicles/vehicle.ts";
import { Car } from "../vehicles/car.ts";

export class CarStore extends VehicleStore {
  protected createVehicle(): Vehicle {
    return new Car();
  }
}
