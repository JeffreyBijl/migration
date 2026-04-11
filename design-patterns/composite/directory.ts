import type { FileSystemComponent } from "./fileSystemComponent.ts"

export class Directory implements FileSystemComponent {
  private name: string
  private children: FileSystemComponent[] = []

  public constructor(name: string) {
    this.name = name
  }

  public getName(): string {
    return this.name
  }

  public getSize(): number {
    let totalSize = 0
    for (const child of this.children) {
      totalSize += child.getSize()
    }
    return totalSize
  }

  public print(indent: string): void {
    console.log(`${indent}📁 ${this.name} (${this.getSize()} KB)`)
    for (const child of this.children) {
      child.print(indent + "  ")
    }
  }

  public add(component: FileSystemComponent): void {
    this.children.push(component)
  }
}
