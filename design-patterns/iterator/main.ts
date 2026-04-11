import { BreakfastMenu } from "./menus/breakfastMenu.ts"
import { LunchMenu } from "./menus/lunchMenu.ts"
import { Waitress } from "./waitress.ts"

console.log("=== Iterator Pattern: Restaurant Menu ===")

const breakfastMenu = new BreakfastMenu()
const lunchMenu = new LunchMenu()

const waitress = new Waitress([breakfastMenu, lunchMenu])

console.log("\n--- Ontbijt Menu (array) ---\n")
const breakfastIterator = breakfastMenu.createIterator()
while (breakfastIterator.hasNext()) {
  const item = breakfastIterator.next()
  console.log(`  ${item.name} - €${item.price.toFixed(2)}`)
  console.log(`    ${item.description}`)
}

console.log("\n--- Lunch Menu (Map) ---\n")
const lunchIterator = lunchMenu.createIterator()
while (lunchIterator.hasNext()) {
  const item = lunchIterator.next()
  console.log(`  ${item.name} - €${item.price.toFixed(2)}`)
  console.log(`    ${item.description}`)
}

console.log("\n--- Serveerster print alles via dezelfde interface ---\n")
waitress.printMenu()
