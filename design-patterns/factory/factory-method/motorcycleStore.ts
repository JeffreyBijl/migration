import { VehicleStore } from "./vehicleStore.ts";
import type { Vehicle } from "../vehicles/vehicle.ts";
import { Motorcycle } from "../vehicles/motorcycle.ts";

export class MotorcycleStore extends VehicleStore {
  protected createVehicle(): Vehicle {
    return new Motorcycle();
  }
}
