export class MusicPlayer {
  private isPlaying: boolean = false;
  private currentSong: string = "";

  public play(song: string): void {
    this.isPlaying = true;
    this.currentSong = song;
    console.log(`🎵 Speelt nu: ${this.currentSong}`);
  }

  public stop(): void {
    console.log(`🎵 Gestopt met afspelen: ${this.currentSong}`);
    this.isPlaying = false;
    this.currentSong = "";
  }

  public getStatus(): string {
    return this.isPlaying ? `speelt: ${this.currentSong}` : "gestopt";
  }
}
