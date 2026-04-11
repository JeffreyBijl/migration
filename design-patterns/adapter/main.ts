import { UniversalPlayer } from "./players/universalPlayer.ts"

const universalPlayer = new UniversalPlayer()

console.log("=== Adapter Pattern: Media Player ===\n")

console.log("Afspelen van verschillende bestandsformaten:\n")

universalPlayer.play("song.mp3")
universalPlayer.play("video.mp4")
universalPlayer.play("movie.vlc")
universalPlayer.play("document.pdf")
