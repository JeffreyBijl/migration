import type { FlyBehavior } from "../behaviors/fly/flyBehavior.ts";
import type { SoundBehavior } from "../behaviors/sound/soundBehavior.ts";

export abstract class Duck {
  constructor(
    protected soundBehavior: SoundBehavior,
    protected flyBehavior: FlyBehavior,
  ) {}

  abstract display(): void;

  swim() {
    console.log("Swim");
  }

  performSound() {
    this.soundBehavior.makeSound();
  }

  performFly() {
    this.flyBehavior.fly();
  }

  setSoundBehavior(behavior: SoundBehavior) {
    this.soundBehavior = behavior;
  }

  setFlyBehavior(behavior: FlyBehavior) {
    this.flyBehavior = behavior;
  }
}
