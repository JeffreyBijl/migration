import type { Image } from "./image.ts"
import { RealImage } from "./realImage.ts"

export class ProxyImage implements Image {
  private realImage: RealImage | null = null

  public constructor(private filename: string) {}

  public display(): void {
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename)
    }
    this.realImage.display()
  }
}
