import type { Vehicle } from "./vehicle.ts";

export class Car implements Vehicle {
  public getType(): string {
    return "Car";
  }

  public getNumberOfWheels(): number {
    return 4;
  }

  public getSpeed(): number {
    return 200;
  }

  public getFuelType(): string {
    return "gasoline";
  }
}
