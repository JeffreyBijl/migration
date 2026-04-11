import type { Beverage } from "./beverage.ts";

export class Espresso implements Beverage {
  public getDescription(): string {
    return "Espresso";
  }

  public getCost(): number {
    return 1.99;
  }
}
