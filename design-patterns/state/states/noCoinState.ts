import type { State } from "./state.ts"
import type { GumballMachine } from "../gumballMachine.ts"

export class NoCoinState implements State {
  private gumballMachine: GumballMachine

  public constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine
  }

  public insertCoin(): void {
    console.log("  Munt geaccepteerd.")
    this.gumballMachine.setState(this.gumballMachine.hasCoinState)
  }

  public ejectCoin(): void {
    console.log("  Geen munt om terug te geven.")
  }

  public turnCrank(): void {
    console.log("  Draai aan de hendel, maar er zit geen munt in.")
  }

  public dispense(): void {
    console.log("  Betaal eerst.")
  }
}
