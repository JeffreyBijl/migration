import { File } from "./file.ts"
import { Directory } from "./directory.ts"

console.log("=== Composite Pattern: Bestandssysteem ===\n")

const root = new Directory("project")

const source = new Directory("src")
source.add(new File("main.ts", 12))
source.add(new File("config.ts", 4))

const components = new Directory("components")
components.add(new File("header.ts", 8))
components.add(new File("footer.ts", 6))
components.add(new File("sidebar.ts", 10))
source.add(components)

const assets = new Directory("assets")
assets.add(new File("logo.png", 256))
assets.add(new File("style.css", 32))

root.add(source)
root.add(assets)
root.add(new File("package.json", 2))
root.add(new File("README.md", 5))

root.print("")

console.log(`\nTotale grootte: ${root.getSize()} KB`)
