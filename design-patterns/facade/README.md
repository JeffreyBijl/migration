# Facade Pattern

## Nederlands

Het Facade pattern is een structureel patroon dat een vereenvoudigde interface biedt voor een complex subsysteem. De client hoeft niet te weten hoe alle onderdelen individueel werken.

### Het probleem

Een home theater systeem bestaat uit meerdere apparaten — projector, versterker, streaming player, verlichting. Om een film te kijken moet je elk apparaat apart aanzetten en configureren. Dat zijn veel stappen die je elke keer opnieuw moet doen.

### De oplossing

Maak een **Facade** die alle complexe stappen achter één simpele methode verstopt. De `HomeTheaterFacade` biedt `watchMovie()` en `endMovie()` — de client hoeft maar één methode aan te roepen.

- `Projector`, `Amplifier`, `StreamingPlayer`, `Lights` — subsysteem-componenten met hun eigen interfaces
- `HomeTheaterFacade` — vereenvoudigde interface die alle componenten coördineert

### Structuur

```
facade/
  devices/
    projector.ts              # Subsysteem: projector
    amplifier.ts              # Subsysteem: versterker
    streamingPlayer.ts        # Subsysteem: streaming player
    lights.ts                 # Subsysteem: verlichting
  homeTheaterFacade.ts        # Facade: watchMovie(), endMovie()
  main.ts                     # Demo
```

### Uitvoeren

```bash
npm run facade
```

### Kernprincipe

> Bied een vereenvoudigde interface voor een complex subsysteem. De facade dwingt je niet om het subsysteem te gebruiken — je kunt altijd rechtstreeks bij de onderdelen.

---

## English

The Facade pattern is a structural pattern that provides a simplified interface to a complex subsystem. The client doesn't need to know how all the individual components work.

### The problem

A home theater system consists of multiple devices — projector, amplifier, streaming player, lights. To watch a movie you have to turn on and configure each device separately. That's many steps you need to repeat every time.

### The solution

Create a **Facade** that hides all complex steps behind one simple method. The `HomeTheaterFacade` offers `watchMovie()` and `endMovie()` — the client only needs to call one method.

- `Projector`, `Amplifier`, `StreamingPlayer`, `Lights` — subsystem components with their own interfaces
- `HomeTheaterFacade` — simplified interface that coordinates all components

### Structure

```
facade/
  devices/
    projector.ts              # Subsystem: projector
    amplifier.ts              # Subsystem: amplifier
    streamingPlayer.ts        # Subsystem: streaming player
    lights.ts                 # Subsystem: lights
  homeTheaterFacade.ts        # Facade: watchMovie(), endMovie()
  main.ts                     # Demo
```

### Run

```bash
npm run facade
```

### Core principle

> Provide a simplified interface to a complex subsystem. The facade doesn't force you to use the subsystem — you can always access the components directly.
