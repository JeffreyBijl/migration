import type { Command } from "./command.ts";
import { Light } from "../devices/light.ts";

export class TurnOnLightCommand implements Command {
  private light: Light;

  public constructor(light: Light) {
    this.light = light;
  }

  public execute(): void {
    this.light.turnOn();
  }

  public undo(): void {
    this.light.turnOff();
  }
}
