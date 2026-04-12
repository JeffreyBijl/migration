import type { Command } from "./command.ts";
import { Light } from "../devices/light.ts";

export class TurnOnLightCommand implements Command {
  public constructor(private light: Light) {}

  public execute(): void {
    this.light.turnOn();
  }

  public undo(): void {
    this.light.turnOff();
  }
}
