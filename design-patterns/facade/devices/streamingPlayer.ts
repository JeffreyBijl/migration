export class StreamingPlayer {
  public play(movie: string): void {
    console.log(`  Streaming Player: "${movie}" wordt afgespeeld`)
  }

  public stop(): void {
    console.log("  Streaming Player: gestopt")
  }

  public turnOff(): void {
    console.log("  Streaming Player: uit")
  }
}
