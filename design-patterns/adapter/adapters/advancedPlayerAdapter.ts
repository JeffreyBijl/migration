import type { MediaPlayer } from "../players/mediaPlayer.ts"
import type { AdvancedMediaPlayer } from "../advanced-players/advancedMediaPlayer.ts"
import { Mp4Player } from "../advanced-players/mp4Player.ts"
import { VlcPlayer } from "../advanced-players/vlcPlayer.ts"

export class AdvancedPlayerAdapter implements MediaPlayer {
  private advancedMediaPlayer: AdvancedMediaPlayer

  public constructor(audioType: string) {
    if (audioType === "mp4") {
      this.advancedMediaPlayer = new Mp4Player()
    } else if (audioType === "vlc") {
      this.advancedMediaPlayer = new VlcPlayer()
    } else {
      throw new Error(`Onbekend audio type: ${audioType}`)
    }
  }

  public play(filename: string): void {
    const extension = filename.split(".").pop()

    if (extension === "mp4") {
      this.advancedMediaPlayer.playMp4(filename)
    } else if (extension === "vlc") {
      this.advancedMediaPlayer.playVlc(filename)
    }
  }
}
