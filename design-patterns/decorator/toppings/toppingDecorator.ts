import type { Beverage } from "../beverages/beverage.ts";

export abstract class ToppingDecorator implements Beverage {
  public constructor(protected beverage: Beverage) {}

  public abstract getDescription(): string;
  public abstract getCost(): number;
}
