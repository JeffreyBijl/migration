import { ToppingDecorator } from "./toppingDecorator.ts";

export class Caramel extends ToppingDecorator {
  public getDescription(): string {
    return `${this.beverage.getDescription()}, Karamel`;
  }

  public getCost(): number {
    return this.beverage.getCost() + 0.6;
  }
}
