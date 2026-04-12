import type { State } from "./state.ts"
import type { GumballMachine } from "../gumballMachine.ts"

export class HasCoinState implements State {
  public constructor(private gumballMachine: GumballMachine) {}

  public insertCoin(): void {
    console.log("  Er zit al een munt in.")
  }

  public ejectCoin(): void {
    console.log("  Munt wordt teruggegeven.")
    this.gumballMachine.setState(this.gumballMachine.noCoinState)
  }

  public turnCrank(): void {
    console.log("  Hendel gedraaid...")
    this.gumballMachine.setState(this.gumballMachine.soldState)
  }

  public dispense(): void {
    console.log("  Nog geen kauwgombal uitgegeven.")
  }
}
