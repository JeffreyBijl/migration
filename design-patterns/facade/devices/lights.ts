export class Lights {
  public dim(level: number): void {
    console.log(`  Verlichting: gedimd naar ${level}%`)
  }

  public turnOn(): void {
    console.log("  Verlichting: aan (100%)")
  }
}
