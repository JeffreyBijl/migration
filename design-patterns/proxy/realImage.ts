import type { Image } from "./image.ts"

export class RealImage implements Image {
  public constructor(private filename: string) {
    this.loadFromDisk()
  }

  public display(): void {
    console.log(`  Afbeelding weergeven: ${this.filename}`)
  }

  private loadFromDisk(): void {
    console.log(`  Afbeelding laden van schijf: ${this.filename}...`)
  }
}
