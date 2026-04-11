# Proxy Pattern

## Nederlands

Het Proxy pattern is een structureel patroon dat een plaatsvervanger biedt voor een ander object. De proxy controleert de toegang tot het echte object.

### Het probleem

Het laden van grote afbeeldingen is een dure operatie. Als je meerdere afbeeldingen tegelijk aanmaakt, wil je niet dat ze allemaal direct van schijf geladen worden — alleen wanneer ze daadwerkelijk weergegeven moeten worden.

### De oplossing

Maak een **Proxy** die dezelfde interface implementeert als het echte object. De proxy stelt het aanmaken van het echte object uit tot het moment dat het nodig is (lazy loading). Bij volgende aanroepen wordt het gecachte object hergebruikt.

- `Image` — interface met `display()`
- `RealImage` — het echte object: laadt afbeelding bij aanmaken
- `ProxyImage` — proxy: maakt `RealImage` pas aan bij eerste `display()` aanroep

### Structuur

```
proxy/
  image.ts                    # Interface
  realImage.ts                # Echt object (dure operatie)
  proxyImage.ts               # Proxy (lazy loading)
  main.ts                     # Demo
```

### Uitvoeren

```bash
npm run proxy
```

### Kernprincipe

> Bied een plaatsvervanger voor een ander object om de toegang te controleren. De proxy kan lazy loading, caching, toegangscontrole of logging toevoegen zonder het echte object te wijzigen.

---

## English

The Proxy pattern is a structural pattern that provides a surrogate for another object. The proxy controls access to the real object.

### The problem

Loading large images is an expensive operation. When you create multiple images at once, you don't want them all loaded from disk immediately — only when they actually need to be displayed.

### The solution

Create a **Proxy** that implements the same interface as the real object. The proxy defers creating the real object until the moment it's needed (lazy loading). On subsequent calls, the cached object is reused.

- `Image` — interface with `display()`
- `RealImage` — the real object: loads image on creation
- `ProxyImage` — proxy: creates `RealImage` only on first `display()` call

### Structure

```
proxy/
  image.ts                    # Interface
  realImage.ts                # Real object (expensive operation)
  proxyImage.ts               # Proxy (lazy loading)
  main.ts                     # Demo
```

### Run

```bash
npm run proxy
```

### Core principle

> Provide a surrogate for another object to control access. The proxy can add lazy loading, caching, access control, or logging without modifying the real object.
