import type { Image } from "./image.ts"

export class RealImage implements Image {
  private filename: string

  public constructor(filename: string) {
    this.filename = filename
    this.loadFromDisk()
  }

  public display(): void {
    console.log(`  Afbeelding weergeven: ${this.filename}`)
  }

  private loadFromDisk(): void {
    console.log(`  Afbeelding laden van schijf: ${this.filename}...`)
  }
}
