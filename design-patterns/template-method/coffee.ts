import { HotBeverage } from "./hotBeverage.ts"

export class Coffee extends HotBeverage {
  protected brew(): void {
    console.log("  Koffie zetten door water door gemalen bonen te filteren...")
  }

  protected addCondiments(): void {
    console.log("  Melk en suiker toevoegen...")
  }
}
