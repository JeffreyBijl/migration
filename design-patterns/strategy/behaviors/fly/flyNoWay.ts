import type { FlyBehavior } from "./flyBehavior.ts";

export class FlyNoWay implements FlyBehavior {
  fly() {
    console.log("Fly no way!");
  }
}
