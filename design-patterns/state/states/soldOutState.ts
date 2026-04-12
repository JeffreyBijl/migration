import type { State } from "./state.ts"
import type { GumballMachine } from "../gumballMachine.ts"

export class SoldOutState implements State {
  public constructor(private gumballMachine: GumballMachine) {}

  public insertCoin(): void {
    console.log("  Munt geweigerd, automaat is leeg.")
  }

  public ejectCoin(): void {
    console.log("  Geen munt om terug te geven.")
  }

  public turnCrank(): void {
    console.log("  Automaat is leeg, draaien heeft geen zin.")
  }

  public dispense(): void {
    console.log("  Geen kauwgombal beschikbaar.")
  }
}
