import type { Menu } from "./menu.ts"
import type { MenuIterator } from "../iterators/menuIterator.ts"
import { MenuItem } from "../menuItem.ts"
import { LunchMenuIterator } from "../iterators/lunchMenuIterator.ts"

export class LunchMenu implements Menu {
  private menuItems: Map<string, MenuItem> = new Map()

  public constructor() {
    this.addItem("Tomatensoep", "Huisgemaakte tomatensoep met basilicum", 5.49)
    this.addItem("Club Sandwich", "Kip, spek, sla en tomaat", 7.99)
    this.addItem("Caesar Salade", "Romaine sla met Parmezaan en croutons", 6.49)
  }

  public createIterator(): MenuIterator {
    return new LunchMenuIterator(this.menuItems)
  }

  private addItem(name: string, description: string, price: number): void {
    const item = new MenuItem(name, description, price)
    this.menuItems.set(name, item)
  }
}
