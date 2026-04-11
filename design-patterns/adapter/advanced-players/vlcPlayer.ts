import type { AdvancedMediaPlayer } from "./advancedMediaPlayer.ts"

export class VlcPlayer implements AdvancedMediaPlayer {
  public playMp4(filename: string): void {
    // VlcPlayer kan geen MP4 afspelen
  }

  public playVlc(filename: string): void {
    console.log(`VLC Player speelt bestand af: ${filename}`)
  }
}
