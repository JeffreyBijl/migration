import type { Vehicle } from "./vehicle.ts";

export class Motorcycle implements Vehicle {
  public getType(): string {
    return "Motorcycle";
  }

  public getNumberOfWheels(): number {
    return 2;
  }

  public getSpeed(): number {
    return 180;
  }

  public getFuelType(): string {
    return "gasoline";
  }
}
