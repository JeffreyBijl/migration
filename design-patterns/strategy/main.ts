import { FlyNoWay } from "./behaviors/fly/flyNoWay.ts";
import { FlyWithWings } from "./behaviors/fly/flyWithWings.ts";
import { MuteSound } from "./behaviors/sound/muteSound.ts";
import { QuackSound } from "./behaviors/sound/quackSound.ts";
import { SqueakSound } from "./behaviors/sound/squeakSound.ts";
import { BlueDuck } from "./ducks/blueDuck.ts";
import { Duck } from "./ducks/duck.ts";
import { RedDuck } from "./ducks/redDuck.ts";
import { RubberDuck } from "./ducks/rubberDuck.ts";

const ducks: Duck[] = [
  new RedDuck(new QuackSound(), new FlyWithWings()),
  new BlueDuck(new SqueakSound(), new FlyWithWings()),
  new RubberDuck(new MuteSound(), new FlyNoWay()),
];
const [redDuck] = ducks;

for (const duck of ducks) {
  duck.display();
  duck.swim();
  duck.performSound();
  duck.performFly();
}

// Runtime-wissel: laat de rode eend stil worden
console.log("--- na setSoundBehavior ---");
redDuck.setSoundBehavior(new MuteSound());
redDuck.display();
redDuck.performSound();
