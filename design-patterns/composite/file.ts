import type { FileSystemComponent } from "./fileSystemComponent.ts"

export class File implements FileSystemComponent {
  public constructor(private name: string, private size: number) {}

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
