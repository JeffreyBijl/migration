import type { MenuIterator } from "./menuIterator.ts"
import type { MenuItem } from "../menuItem.ts"

export class BreakfastMenuIterator implements MenuIterator {
  private position: number = 0

  public constructor(private items: MenuItem[]) {}

  public hasNext(): boolean {
    return this.position < this.items.length
  }

  public next(): MenuItem {
    const item = this.items[this.position]
    this.position++
    return item
  }
}
