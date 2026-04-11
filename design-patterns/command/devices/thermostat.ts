export class Thermostat {
  private temperature: number = 20;

  public setTemperature(temperature: number): void {
    this.temperature = temperature;
    console.log(`🌡️  Thermostaat ingesteld op ${this.temperature}°C`);
  }

  public getTemperature(): number {
    return this.temperature;
  }
}
