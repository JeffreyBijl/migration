import type { State } from "./states/state.ts"
import { NoCoinState } from "./states/noCoinState.ts"
import { HasCoinState } from "./states/hasCoinState.ts"
import { SoldState } from "./states/soldState.ts"
import { SoldOutState } from "./states/soldOutState.ts"

export class GumballMachine {
  public noCoinState: State
  public hasCoinState: State
  public soldState: State
  public soldOutState: State

  private currentState: State
  private count: number

  public constructor(numberOfGumballs: number) {
    this.noCoinState = new NoCoinState(this)
    this.hasCoinState = new HasCoinState(this)
    this.soldState = new SoldState(this)
    this.soldOutState = new SoldOutState(this)

    this.count = numberOfGumballs

    if (numberOfGumballs > 0) {
      this.currentState = this.noCoinState
    } else {
      this.currentState = this.soldOutState
    }
  }

  public insertCoin(): void {
    this.currentState.insertCoin()
  }

  public ejectCoin(): void {
    this.currentState.ejectCoin()
  }

  public turnCrank(): void {
    this.currentState.turnCrank()
    this.currentState.dispense()
  }

  public setState(state: State): void {
    this.currentState = state
  }

  public releaseBall(): void {
    if (this.count > 0) {
      console.log("  Een kauwgombal komt eruit rollen...")
      this.count--
    }
  }

  public getCount(): number {
    return this.count
  }
}
