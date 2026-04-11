import type { Vehicle } from "../vehicles/vehicle.ts";
import { Car } from "../vehicles/car.ts";
import { Motorcycle } from "../vehicles/motorcycle.ts";
import { Bicycle } from "../vehicles/bicycle.ts";

export class VehicleFactory {
  public createVehicle(type: string): Vehicle {
    switch (type) {
      case "car":
        return new Car();
      case "motorcycle":
        return new Motorcycle();
      case "bicycle":
        return new Bicycle();
      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}
