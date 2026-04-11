import type { Command } from "./command.ts";
import { MusicPlayer } from "../devices/music-player.ts";

export class PlayMusicCommand implements Command {
  private musicPlayer: MusicPlayer;
  private song: string;

  public constructor(musicPlayer: MusicPlayer, song: string) {
    this.musicPlayer = musicPlayer;
    this.song = song;
  }

  public execute(): void {
    this.musicPlayer.play(this.song);
  }

  public undo(): void {
    this.musicPlayer.stop();
  }
}
