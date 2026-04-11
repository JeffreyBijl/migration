import type { MenuIterator } from "./menuIterator.ts"
import type { MenuItem } from "../menuItem.ts"

export class LunchMenuIterator implements MenuIterator {
  private items: MenuItem[]
  private position: number = 0

  public constructor(itemsMap: Map<string, MenuItem>) {
    this.items = Array.from(itemsMap.values())
  }

  public hasNext(): boolean {
    return this.position < this.items.length
  }

  public next(): MenuItem {
    const item = this.items[this.position]
    this.position++
    return item
  }
}
