import type { MediaPlayer } from "./mediaPlayer.ts"
import { Mp3Player } from "./mp3Player.ts"
import { AdvancedPlayerAdapter } from "../adapters/advancedPlayerAdapter.ts"

export class UniversalPlayer implements MediaPlayer {
  private mp3Player: Mp3Player = new Mp3Player()

  public play(filename: string): void {
    const extension = filename.split(".").pop()

    if (extension === "mp3") {
      this.mp3Player.play(filename)
    } else if (extension === "mp4" || extension === "vlc") {
      const adapter = new AdvancedPlayerAdapter(extension)
      adapter.play(filename)
    } else {
      console.log(`Onbekend formaat: ${extension} - kan ${filename} niet afspelen`)
    }
  }
}
