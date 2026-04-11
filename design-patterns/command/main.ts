import { Light } from "./devices/light.ts";
import { Thermostat } from "./devices/thermostat.ts";
import { MusicPlayer } from "./devices/music-player.ts";
import { TurnOnLightCommand } from "./commands/turn-on-light-command.ts";
import { SetTemperatureCommand } from "./commands/set-temperature-command.ts";
import { PlayMusicCommand } from "./commands/play-music-command.ts";
import { RemoteControl } from "./remote-control.ts";

// Receivers — de apparaten in het smart home
const light = new Light();
const thermostat = new Thermostat();
const musicPlayer = new MusicPlayer();

// Commands — acties verpakt als objecten
const turnOnLight = new TurnOnLightCommand(light);
const setTemperature = new SetTemperatureCommand(thermostat, 23);
const playMusic = new PlayMusicCommand(musicPlayer, "Bohemian Rhapsody");

// Invoker — de afstandsbediening
const remoteControl = new RemoteControl();

console.log("=== Smart Home starten ===\n");

// Voer commands uit via de afstandsbediening
remoteControl.pressButton(turnOnLight);
remoteControl.pressButton(setTemperature);
remoteControl.pressButton(playMusic);

console.log(`\nCommands in history: ${remoteControl.getHistoryLength()}`);

// Maak de laatste acties ongedaan
console.log("\n=== Undo ===\n");

remoteControl.pressUndo(); // Stopt muziek
remoteControl.pressUndo(); // Zet temperatuur terug naar 20
remoteControl.pressUndo(); // Zet licht uit

console.log(`\nCommands in history: ${remoteControl.getHistoryLength()}`);

// Probeer nog een keer undo — er is niets meer
console.log("");
remoteControl.pressUndo();
