# Singleton Pattern

## Nederlands

Het Singleton pattern is een creationeel patroon dat garandeert dat een class maar één instantie heeft, en biedt een globaal toegangspunt tot die instantie.

### Het probleem

Een applicatie heeft meerdere services die allemaal logberichten willen schrijven. Als elke service zijn eigen `Logger` aanmaakt, krijg je verspreide logboeken zonder samenhang. Je wilt dat alle berichten via één centraal punt lopen, zodat de volledige history op één plek staat.

### De oplossing

Maak de constructor van `Logger` **private**, zodat niemand van buitenaf `new Logger()` kan aanroepen. Bied in plaats daarvan een **statische `getInstance()` methode** aan die altijd dezelfde instantie teruggeeft. De eerste keer wordt de instantie aangemaakt, daarna wordt steeds dezelfde hergebruikt.

- `Logger` — de singleton class met private constructor en statische `getInstance()`
- `log()`, `warn()`, `error()` — methodes om berichten te schrijven
- `getHistory()` — geeft alle gelogde berichten terug

Omdat er maar één instantie bestaat, bevat de history altijd het complete overzicht — ongeacht vanuit welke service er gelogd wordt.

### Structuur

```
singleton/
  logger.ts       # Singleton class met private constructor en getInstance()
  main.ts         # Demo: meerdere services gebruiken dezelfde logger
```

### Uitvoeren

```bash
npm run singleton
```

### Kernprincipe

> Zorg dat een class maar één instantie heeft en bied een globaal toegangspunt. Gebruik dit wanneer gedeelde staat of coördinatie vanuit één plek moet komen.

---

## English

The Singleton pattern is a creational pattern that ensures a class has only one instance, and provides a global access point to that instance.

### The problem

An application has multiple services that all want to write log messages. If each service creates its own `Logger`, you end up with scattered logs without coherence. You want all messages to flow through one central point, so the complete history lives in one place.

### The solution

Make the `Logger` constructor **private**, so no one can call `new Logger()` from outside. Instead, provide a **static `getInstance()` method** that always returns the same instance. The first time it creates the instance, after that it reuses the same one.

- `Logger` — the singleton class with private constructor and static `getInstance()`
- `log()`, `warn()`, `error()` — methods to write messages
- `getHistory()` — returns all logged messages

Because only one instance exists, the history always contains the complete overview — regardless of which service logged the message.

### Structure

```
singleton/
  logger.ts       # Singleton class with private constructor and getInstance()
  main.ts         # Demo: multiple services use the same logger
```

### Run

```bash
npm run singleton
```

### Core principle

> Ensure a class has only one instance and provide a global access point. Use this when shared state or coordination needs to come from a single place.
