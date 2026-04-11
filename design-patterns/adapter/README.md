# Adapter Pattern

## Nederlands

Het Adapter pattern is een structureel patroon dat een incompatibele interface vertaalt naar een interface die de client verwacht. Hierdoor kunnen classes samenwerken die anders niet compatibel zouden zijn.

### Het probleem

Een media player applicatie kan alleen MP3 bestanden afspelen via de `MediaPlayer` interface. Er bestaan geavanceerde spelers voor MP4 en VLC, maar die hebben een compleet andere interface (`AdvancedMediaPlayer`). De applicatie moet alle formaten kunnen afspelen zonder de bestaande code aan te passen.

### De oplossing

Maak een **Adapter** die de `MediaPlayer` interface implementeert en intern de juiste `AdvancedMediaPlayer` aanroept. De client (`UniversalPlayer`) werkt alleen met `MediaPlayer` en hoeft niets te weten over de geavanceerde spelers.

- `MediaPlayer` — target interface met `play(filename)`
- `AdvancedMediaPlayer` — adaptee interface met `playMp4()` en `playVlc()`
- `Mp4Player`, `VlcPlayer` — concrete adaptees die geavanceerde formaten afspelen
- `AdvancedPlayerAdapter` — adapter die `MediaPlayer` vertaalt naar `AdvancedMediaPlayer`
- `UniversalPlayer` — client die alle formaten afspeelt via de adapter

### Structuur

```
adapter/
  players/
    mediaPlayer.ts               # Target interface
    mp3Player.ts                 # Bestaande speler: MP3
    universalPlayer.ts           # Client: speelt alle formaten af
  advanced-players/
    advancedMediaPlayer.ts       # Adaptee interface
    mp4Player.ts                 # Concrete adaptee: MP4
    vlcPlayer.ts                 # Concrete adaptee: VLC
  adapters/
    advancedPlayerAdapter.ts     # Adapter: vertaalt tussen interfaces
  main.ts                        # Demo
```

### Uitvoeren

```bash
npm run adapter
```

### Kernprincipe

> Vertaal een interface naar een andere interface die de client verwacht. De adapter laat classes samenwerken die anders incompatibel zouden zijn.

---

## English

The Adapter pattern is a structural pattern that translates an incompatible interface into one that the client expects. This allows classes to work together that otherwise wouldn't be compatible.

### The problem

A media player application can only play MP3 files via the `MediaPlayer` interface. Advanced players exist for MP4 and VLC, but they have a completely different interface (`AdvancedMediaPlayer`). The application needs to play all formats without modifying existing code.

### The solution

Create an **Adapter** that implements the `MediaPlayer` interface and internally calls the appropriate `AdvancedMediaPlayer`. The client (`UniversalPlayer`) only works with `MediaPlayer` and doesn't need to know anything about the advanced players.

- `MediaPlayer` — target interface with `play(filename)`
- `AdvancedMediaPlayer` — adaptee interface with `playMp4()` and `playVlc()`
- `Mp4Player`, `VlcPlayer` — concrete adaptees that play advanced formats
- `AdvancedPlayerAdapter` — adapter that translates `MediaPlayer` to `AdvancedMediaPlayer`
- `UniversalPlayer` — client that plays all formats via the adapter

### Structure

```
adapter/
  players/
    mediaPlayer.ts               # Target interface
    mp3Player.ts                 # Existing player: MP3
    universalPlayer.ts           # Client: plays all formats
  advanced-players/
    advancedMediaPlayer.ts       # Adaptee interface
    mp4Player.ts                 # Concrete adaptee: MP4
    vlcPlayer.ts                 # Concrete adaptee: VLC
  adapters/
    advancedPlayerAdapter.ts     # Adapter: translates between interfaces
  main.ts                        # Demo
```

### Run

```bash
npm run adapter
```

### Core principle

> Convert an interface into another interface the client expects. The adapter lets classes work together that otherwise would be incompatible.
