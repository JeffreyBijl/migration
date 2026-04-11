import { ToppingDecorator } from "./toppingDecorator.ts";

export class WhippedCream extends ToppingDecorator {
  public getDescription(): string {
    return `${this.beverage.getDescription()}, Slagroom`;
  }

  public getCost(): number {
    return this.beverage.getCost() + 0.5;
  }
}
