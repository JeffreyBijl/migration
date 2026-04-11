import { VehicleStore } from "./vehicleStore.ts";
import type { Vehicle } from "../vehicles/vehicle.ts";
import { Bicycle } from "../vehicles/bicycle.ts";

export class BicycleStore extends VehicleStore {
  protected createVehicle(): Vehicle {
    return new Bicycle();
  }
}
