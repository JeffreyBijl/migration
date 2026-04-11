import type { Vehicle } from "./vehicle.ts";

export class Bicycle implements Vehicle {
  public getType(): string {
    return "Bicycle";
  }

  public getNumberOfWheels(): number {
    return 2;
  }

  public getSpeed(): number {
    return 25;
  }

  public getFuelType(): string {
    return "muscle";
  }
}
