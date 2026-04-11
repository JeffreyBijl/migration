import type { Beverage } from "../beverages/beverage.ts";

export abstract class ToppingDecorator implements Beverage {
  protected beverage: Beverage;

  constructor(beverage: Beverage) {
    this.beverage = beverage;
  }

  public abstract getDescription(): string;
  public abstract getCost(): number;
}
