import type { Image } from "./image.ts"
import { RealImage } from "./realImage.ts"

export class ProxyImage implements Image {
  private filename: string
  private realImage: RealImage | null = null

  public constructor(filename: string) {
    this.filename = filename
  }

  public display(): void {
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename)
    }
    this.realImage.display()
  }
}
