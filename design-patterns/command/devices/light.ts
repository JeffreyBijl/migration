export class Light {
  private isOn: boolean = false;

  public turnOn(): void {
    this.isOn = true;
    console.log("💡 Licht is aan");
  }

  public turnOff(): void {
    this.isOn = false;
    console.log("💡 Licht is uit");
  }

  public getStatus(): string {
    return this.isOn ? "aan" : "uit";
  }
}
