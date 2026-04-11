import type { Menu } from "./menu.ts"
import type { MenuIterator } from "../iterators/menuIterator.ts"
import { MenuItem } from "../menuItem.ts"
import { BreakfastMenuIterator } from "../iterators/breakfastMenuIterator.ts"

export class BreakfastMenu implements Menu {
  private menuItems: MenuItem[] = []

  public constructor() {
    this.addItem("Pannenkoeken", "Pannenkoeken met stroop en boter", 3.99)
    this.addItem("Uitsmijter", "Gebakken eieren op brood met ham", 4.49)
    this.addItem("Croissant", "Verse croissant met jam", 2.99)
  }

  public createIterator(): MenuIterator {
    return new BreakfastMenuIterator(this.menuItems)
  }

  private addItem(name: string, description: string, price: number): void {
    this.menuItems.push(new MenuItem(name, description, price))
  }
}
