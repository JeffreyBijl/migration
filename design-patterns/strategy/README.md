# Strategy Pattern

## Nederlands

Het Strategy pattern is een gedragspatroon (behavioral pattern) waarbij je een familie van algoritmes definieert, ze elk in een aparte class stopt, en ze uitwisselbaar maakt. Hierdoor kan het gedrag van een object tijdens runtime veranderd worden zonder de class zelf aan te passen.

### Het probleem

Stel je hebt een `Duck` class met verschillende soorten eenden. Niet elke eend kan vliegen (een badeend bijvoorbeeld niet) en niet elke eend maakt hetzelfde geluid. Als je dit gedrag direct in de class of via overerving implementeert, krijg je al snel duplicatie of ongewenst gedrag in subclasses.

### De oplossing

In plaats van gedrag vast te leggen in de class hierarchie, definieer je **interfaces** voor elk variabel gedrag:

- `FlyBehavior` - hoe een eend vliegt (of niet)
- `SoundBehavior` - welk geluid een eend maakt

Elke concrete implementatie (bijv. `FlyWithWings`, `FlyNoWay`, `QuackSound`, `MuteSound`) is een aparte class die de interface implementeert. De `Duck` class krijgt deze gedragingen via de constructor en kan ze tijdens runtime wisselen via setter-methodes.

### Structuur

```
behaviors/
  fly/
    flyBehavior.ts        # Interface
    flyWithWings.ts       # Kan vliegen
    flyNoWay.ts           # Kan niet vliegen
  sound/
    soundBehavior.ts      # Interface
    quackSound.ts         # Kwaakt
    squeakSound.ts        # Piept
    muteSound.ts          # Stil
ducks/
  duck.ts                 # Abstracte basisclass
  redDuck.ts              # Concrete eend
  blueDuck.ts             # Concrete eend
  rubberDuck.ts           # Concrete eend (kan niet vliegen, is stil)
```

### Uitvoeren

```bash
npm run strategy
```

### Kernprincipe

> Stel samen (composition) in plaats van overerving. Programmeer naar een interface, niet naar een implementatie.

---

## English

The Strategy pattern is a behavioral pattern where you define a family of algorithms, encapsulate each one in its own class, and make them interchangeable. This allows the behavior of an object to change at runtime without modifying the class itself.

### The problem

Imagine a `Duck` class with different types of ducks. Not every duck can fly (a rubber duck, for example) and not every duck makes the same sound. If you implement this behavior directly in the class or through inheritance, you quickly end up with duplication or unwanted behavior in subclasses.

### The solution

Instead of hardcoding behavior in the class hierarchy, you define **interfaces** for each variable behavior:

- `FlyBehavior` - how a duck flies (or doesn't)
- `SoundBehavior` - what sound a duck makes

Each concrete implementation (e.g. `FlyWithWings`, `FlyNoWay`, `QuackSound`, `MuteSound`) is a separate class that implements the interface. The `Duck` class receives these behaviors through its constructor and can swap them at runtime via setter methods.

### Structure

```
behaviors/
  fly/
    flyBehavior.ts        # Interface
    flyWithWings.ts       # Can fly
    flyNoWay.ts           # Cannot fly
  sound/
    soundBehavior.ts      # Interface
    quackSound.ts         # Quacks
    squeakSound.ts        # Squeaks
    muteSound.ts          # Silent
ducks/
  duck.ts                 # Abstract base class
  redDuck.ts              # Concrete duck
  blueDuck.ts             # Concrete duck
  rubberDuck.ts           # Concrete duck (cannot fly, is silent)
```

### Run

```bash
npm run strategy
```

### Core principle

> Favor composition over inheritance. Program to an interface, not an implementation.
