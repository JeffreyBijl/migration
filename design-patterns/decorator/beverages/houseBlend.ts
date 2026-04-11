import type { Beverage } from "./beverage.ts";

export class HouseBlend implements Beverage {
  public getDescription(): string {
    return "House Blend";
  }

  public getCost(): number {
    return 0.89;
  }
}
