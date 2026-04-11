import { Coffee } from "./coffee.ts"
import { Tea } from "./tea.ts"

console.log("=== Template Method Pattern: Warme Dranken ===")

const coffee = new Coffee()
const tea = new Tea()

console.log("\n--- Koffie bereiden ---\n")
coffee.prepareRecipe()

console.log("\n--- Thee bereiden ---\n")
tea.prepareRecipe()
