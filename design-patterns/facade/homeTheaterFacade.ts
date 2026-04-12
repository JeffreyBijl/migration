import { Projector } from "./devices/projector.ts"
import { Amplifier } from "./devices/amplifier.ts"
import { StreamingPlayer } from "./devices/streamingPlayer.ts"
import { Lights } from "./devices/lights.ts"

export class HomeTheaterFacade {
  public constructor(
    private projector: Projector,
    private amplifier: Amplifier,
    private streamingPlayer: StreamingPlayer,
    private lights: Lights
  ) {}

  public watchMovie(movie: string): void {
    console.log(`\nFilm klaarzetten: "${movie}"...\n`)
    this.lights.dim(10)
    this.projector.turnOn()
    this.projector.setWidescreen()
    this.amplifier.turnOn()
    this.amplifier.setVolume(7)
    this.streamingPlayer.play(movie)
    console.log("\n...klaar! Geniet van de film.\n")
  }

  public endMovie(): void {
    console.log("\nFilm beëindigen...\n")
    this.streamingPlayer.stop()
    this.streamingPlayer.turnOff()
    this.amplifier.turnOff()
    this.projector.turnOff()
    this.lights.turnOn()
    console.log("\n...alles uitgeschakeld.\n")
  }
}
