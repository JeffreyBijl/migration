import type { SoundBehavior } from "./soundBehavior.ts";

export class SqueakSound implements SoundBehavior {
  makeSound() {
    console.log("Squeak!");
  }
}
