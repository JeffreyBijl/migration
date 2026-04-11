import type { MediaPlayer } from "./mediaPlayer.ts"

export class Mp3Player implements MediaPlayer {
  public play(filename: string): void {
    console.log(`MP3 Player speelt bestand af: ${filename}`)
  }
}
