# Command Pattern

## Nederlands

Het Command pattern is een gedragspatroon dat een verzoek verpakt als een object. Hierdoor kun je acties parametriseren, in een wachtrij plaatsen en ongedaan maken.

### Het probleem

Een smart home heeft meerdere apparaten — lampen, een thermostaat, een muziekspeler. Je wilt deze apparaten bedienen via een afstandsbediening, zonder dat de afstandsbediening hoeft te weten hoe elk apparaat werkt. Daarnaast wil je acties ongedaan kunnen maken.

### De oplossing

Verpak elke actie als een **Command object** met een `execute()` en `undo()` methode. De afstandsbediening (invoker) kent alleen de `Command` interface en houdt een history bij. De apparaten (receivers) voeren het echte werk uit.

- `Command` — interface met `execute()` en `undo()`
- `TurnOnLightCommand`, `SetTemperatureCommand`, `PlayMusicCommand` — concrete commands die een receiver aansturen
- `Light`, `Thermostat`, `MusicPlayer` — receivers die de acties uitvoeren
- `RemoteControl` — invoker die commands uitvoert en undo ondersteunt via een history stack

### Structuur

```
command/
  commands/
    command.ts                 # Command interface
    turn-on-light-command.ts   # Concrete command: licht aan
    set-temperature-command.ts # Concrete command: temperatuur instellen
    play-music-command.ts      # Concrete command: muziek afspelen
  devices/
    light.ts                   # Receiver: lamp
    thermostat.ts              # Receiver: thermostaat
    music-player.ts            # Receiver: muziekspeler
  remote-control.ts            # Invoker: afstandsbediening met undo
  main.ts                      # Demo
```

### Uitvoeren

```bash
npm run command
```

### Kernprincipe

> Verpak een verzoek als een object, zodat je acties kunt parametriseren, in een wachtrij kunt plaatsen en ongedaan kunt maken. De aanroeper hoeft niets te weten over de ontvanger.

---

## English

The Command pattern is a behavioral pattern that encapsulates a request as an object. This allows you to parameterize actions, queue them, and undo them.

### The problem

A smart home has multiple devices — lights, a thermostat, a music player. You want to control these devices via a remote control, without the remote needing to know how each device works. Additionally, you want to be able to undo actions.

### The solution

Wrap each action as a **Command object** with an `execute()` and `undo()` method. The remote control (invoker) only knows the `Command` interface and maintains a history. The devices (receivers) perform the actual work.

- `Command` — interface with `execute()` and `undo()`
- `TurnOnLightCommand`, `SetTemperatureCommand`, `PlayMusicCommand` — concrete commands that control a receiver
- `Light`, `Thermostat`, `MusicPlayer` — receivers that perform the actions
- `RemoteControl` — invoker that executes commands and supports undo via a history stack

### Structure

```
command/
  commands/
    command.ts                 # Command interface
    turn-on-light-command.ts   # Concrete command: turn on light
    set-temperature-command.ts # Concrete command: set temperature
    play-music-command.ts      # Concrete command: play music
  devices/
    light.ts                   # Receiver: light
    thermostat.ts              # Receiver: thermostat
    music-player.ts            # Receiver: music player
  remote-control.ts            # Invoker: remote control with undo
  main.ts                      # Demo
```

### Run

```bash
npm run command
```

### Core principle

> Encapsulate a request as an object, so you can parameterize actions, queue them, and undo them. The invoker doesn't need to know anything about the receiver.
