# Iterator Pattern

## Nederlands

Het Iterator pattern is een gedragspatroon dat een manier biedt om door een collectie te itereren zonder de interne structuur te kennen.

### Het probleem

Een restaurant heeft twee menu's: het ontbijtmenu slaat items op in een array, het lunchmenu in een Map. De serveerster wil beide menu's op dezelfde manier doorlopen, maar de collecties hebben verschillende interfaces.

### De oplossing

Definieer een **Iterator** interface met `hasNext()` en `next()`. Elk menu maakt zijn eigen iterator aan die weet hoe de interne collectie doorlopen moet worden. De serveerster werkt alleen met de iterator-interface.

- `MenuIterator` — interface met `hasNext()` en `next()`
- `BreakfastMenuIterator` — itereert over een array
- `LunchMenuIterator` — itereert over een Map
- `Menu` — interface met `createIterator()`
- `BreakfastMenu`, `LunchMenu` — concrete menu's met verschillende interne opslag
- `Waitress` — client die menu's print via de iterator

### Structuur

```
iterator/
  menuItem.ts                     # Model: naam, beschrijving, prijs
  iterators/
    menuIterator.ts               # Iterator interface
    breakfastMenuIterator.ts      # Itereert over array
    lunchMenuIterator.ts          # Itereert over Map
  menus/
    menu.ts                       # Menu interface
    breakfastMenu.ts              # Slaat items op in array
    lunchMenu.ts                  # Slaat items op in Map
  waitress.ts                     # Client: print via iterator
  main.ts                         # Demo
```

### Uitvoeren

```bash
npm run iterator
```

### Kernprincipe

> Bied een uniforme manier om door een collectie te itereren, ongeacht de interne representatie. De client hoeft niet te weten of het een array, Map of iets anders is.

---

## English

The Iterator pattern is a behavioral pattern that provides a way to iterate through a collection without knowing its internal structure.

### The problem

A restaurant has two menus: the breakfast menu stores items in an array, the lunch menu in a Map. The waitress wants to iterate through both menus the same way, but the collections have different interfaces.

### The solution

Define an **Iterator** interface with `hasNext()` and `next()`. Each menu creates its own iterator that knows how to traverse the internal collection. The waitress only works with the iterator interface.

- `MenuIterator` — interface with `hasNext()` and `next()`
- `BreakfastMenuIterator` — iterates over an array
- `LunchMenuIterator` — iterates over a Map
- `Menu` — interface with `createIterator()`
- `BreakfastMenu`, `LunchMenu` — concrete menus with different internal storage
- `Waitress` — client that prints menus via the iterator

### Structure

```
iterator/
  menuItem.ts                     # Model: name, description, price
  iterators/
    menuIterator.ts               # Iterator interface
    breakfastMenuIterator.ts      # Iterates over array
    lunchMenuIterator.ts          # Iterates over Map
  menus/
    menu.ts                       # Menu interface
    breakfastMenu.ts              # Stores items in array
    lunchMenu.ts                  # Stores items in Map
  waitress.ts                     # Client: prints via iterator
  main.ts                         # Demo
```

### Run

```bash
npm run iterator
```

### Core principle

> Provide a uniform way to iterate through a collection, regardless of its internal representation. The client doesn't need to know whether it's an array, Map, or something else.
