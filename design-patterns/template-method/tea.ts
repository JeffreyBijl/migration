import { HotBeverage } from "./hotBeverage.ts"

export class Tea extends HotBeverage {
  protected brew(): void {
    console.log("  Thee laten trekken...")
  }

  protected addCondiments(): void {
    console.log("  Schijfje citroen toevoegen...")
  }
}
