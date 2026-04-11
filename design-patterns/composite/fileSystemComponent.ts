export interface FileSystemComponent {
  getName(): string
  getSize(): number
  print(indent: string): void
}
