import type { AdvancedMediaPlayer } from "./advancedMediaPlayer.ts"

export class Mp4Player implements AdvancedMediaPlayer {
  public playMp4(filename: string): void {
    console.log(`MP4 Player speelt bestand af: ${filename}`)
  }

  public playVlc(filename: string): void {
    // Mp4Player kan geen VLC afspelen
  }
}
