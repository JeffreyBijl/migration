import type { Menu } from "./menus/menu.ts"
import type { MenuIterator } from "./iterators/menuIterator.ts"

export class Waitress {
  private menus: Menu[]

  public constructor(menus: Menu[]) {
    this.menus = menus
  }

  public printMenu(): void {
    for (const menu of this.menus) {
      const iterator = menu.createIterator()
      this.printItems(iterator)
      console.log("")
    }
  }

  private printItems(iterator: MenuIterator): void {
    while (iterator.hasNext()) {
      const item = iterator.next()
      console.log(`  ${item.name} - €${item.price.toFixed(2)}`)
      console.log(`    ${item.description}`)
    }
  }
}
