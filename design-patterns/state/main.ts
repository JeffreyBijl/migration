import { GumballMachine } from "./gumballMachine.ts"

console.log("=== State Pattern: Kauwgombal Automaat ===")

const machine = new GumballMachine(2)

console.log(`\nAutomaat gestart met ${machine.getCount()} kauwgomballen.\n`)

console.log("--- Eerste poging (zonder munt) ---\n")
machine.turnCrank()

console.log("\n--- Munt invoeren en draaien ---\n")
machine.insertCoin()
machine.turnCrank()
console.log(`\n  Kauwgomballen over: ${machine.getCount()}`)

console.log("\n--- Munt invoeren, bedenken, munt terug ---\n")
machine.insertCoin()
machine.ejectCoin()

console.log("\n--- Laatste kauwgombal kopen ---\n")
machine.insertCoin()
machine.turnCrank()
console.log(`\n  Kauwgomballen over: ${machine.getCount()}`)

console.log("\n--- Automaat is leeg ---\n")
machine.insertCoin()
machine.turnCrank()
