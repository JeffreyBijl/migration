import { Projector } from "./devices/projector.ts"
import { Amplifier } from "./devices/amplifier.ts"
import { StreamingPlayer } from "./devices/streamingPlayer.ts"
import { Lights } from "./devices/lights.ts"
import { HomeTheaterFacade } from "./homeTheaterFacade.ts"

console.log("=== Facade Pattern: Home Theater ===")

const projector = new Projector()
const amplifier = new Amplifier()
const streamingPlayer = new StreamingPlayer()
const lights = new Lights()

const homeTheater = new HomeTheaterFacade(projector, amplifier, streamingPlayer, lights)

homeTheater.watchMovie("The Matrix")
homeTheater.endMovie()
