import type { SoundBehavior } from "./soundBehavior.ts";

export class QuackSound implements SoundBehavior {
  makeSound() {
    console.log("Quack!");
  }
}
