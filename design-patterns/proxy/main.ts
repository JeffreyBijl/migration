import { ProxyImage } from "./proxyImage.ts"

console.log("=== Proxy Pattern: Virtual Image Proxy ===\n")

console.log("--- Proxy objecten aanmaken (nog niet geladen) ---\n")
const image1 = new ProxyImage("vakantie.jpg")
const image2 = new ProxyImage("familieportret.jpg")
const image3 = new ProxyImage("landschap.jpg")

console.log("  Drie proxy's aangemaakt, geen afbeelding geladen.\n")

console.log("--- Eerste keer display() aanroepen (laadt van schijf) ---\n")
image1.display()
console.log("")
image2.display()

console.log("\n--- Tweede keer display() aanroepen (gebruikt cache) ---\n")
image1.display()
image2.display()

console.log("\n--- Derde afbeelding pas nu laden ---\n")
image3.display()
