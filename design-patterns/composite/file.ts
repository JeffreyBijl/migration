import type { FileSystemComponent } from "./fileSystemComponent.ts"

export class File implements FileSystemComponent {
  private name: string
  private size: number

  public constructor(name: string, size: number) {
    this.name = name
    this.size = size
  }

  public getName(): string {
    return this.name
  }

  public getSize(): number {
    return this.size
  }

  public print(indent: string): void {
    console.log(`${indent}📄 ${this.name} (${this.size} KB)`)
  }
}
