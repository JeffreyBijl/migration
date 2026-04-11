import { ToppingDecorator } from "./toppingDecorator.ts";

export class Milk extends ToppingDecorator {
  public getDescription(): string {
    return `${this.beverage.getDescription()}, Melk`;
  }

  public getCost(): number {
    return this.beverage.getCost() + 0.3;
  }
}
