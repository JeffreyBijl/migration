import type { Command } from "./command.ts";
import { MusicPlayer } from "../devices/music-player.ts";

export class PlayMusicCommand implements Command {
  public constructor(private musicPlayer: MusicPlayer, private song: string) {}

  public execute(): void {
    this.musicPlayer.play(this.song);
  }

  public undo(): void {
    this.musicPlayer.stop();
  }
}
