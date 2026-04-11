import type { State } from "./state.ts"
import type { GumballMachine } from "../gumballMachine.ts"

export class SoldState implements State {
  private gumballMachine: GumballMachine

  public constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine
  }

  public insertCoin(): void {
    console.log("  Even geduld, kauwgombal wordt uitgegeven.")
  }

  public ejectCoin(): void {
    console.log("  Te laat, hendel is al gedraaid.")
  }

  public turnCrank(): void {
    console.log("  Twee keer draaien geeft geen extra kauwgombal.")
  }

  public dispense(): void {
    this.gumballMachine.releaseBall()
    if (this.gumballMachine.getCount() > 0) {
      this.gumballMachine.setState(this.gumballMachine.noCoinState)
    } else {
      console.log("  Oeps, geen kauwgomballen meer!")
      this.gumballMachine.setState(this.gumballMachine.soldOutState)
    }
  }
}
