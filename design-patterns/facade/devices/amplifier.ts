export class Amplifier {
  public turnOn(): void {
    console.log("  Versterker: aan")
  }

  public setVolume(level: number): void {
    console.log(`  Versterker: volume ingesteld op ${level}`)
  }

  public turnOff(): void {
    console.log("  Versterker: uit")
  }
}
