import type { Command } from "./command.ts";
import { Thermostat } from "../devices/thermostat.ts";

export class SetTemperatureCommand implements Command {
  private thermostat: Thermostat;
  private newTemperature: number;
  private previousTemperature: number = 0;

  public constructor(thermostat: Thermostat, newTemperature: number) {
    this.thermostat = thermostat;
    this.newTemperature = newTemperature;
  }

  public execute(): void {
    this.previousTemperature = this.thermostat.getTemperature();
    this.thermostat.setTemperature(this.newTemperature);
  }

  public undo(): void {
    this.thermostat.setTemperature(this.previousTemperature);
  }
}
