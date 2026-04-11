import type { FlyBehavior } from "./flyBehavior.ts";

export class FlyWithWings implements FlyBehavior {
  fly() {
    console.log("Fly with wings!");
  }
}
