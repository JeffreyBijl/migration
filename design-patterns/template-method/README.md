# Template Method Pattern

## Nederlands

Het Template Method pattern is een gedragspatroon dat het skelet van een algoritme definieert in een base class, terwijl subclasses specifieke stappen invullen zonder de structuur te veranderen.

### Het probleem

Koffie en thee worden op bijna dezelfde manier bereid: water koken, brouwen, inschenken, toevoegingen doen. Maar de details van "brouwen" en "toevoegingen" verschillen. Zonder dit pattern dupliceer je de gemeenschappelijke stappen in elke class.

### De oplossing

Definieer het **algoritme-skelet** in een abstract class (`HotBeverage`) met een `prepareRecipe()` methode die de volgorde vastlegt. De stappen die variëren (`brew()` en `addCondiments()`) zijn abstract — subclasses vullen ze in.

- `HotBeverage` — abstract class met template method `prepareRecipe()`
- `Coffee` — concrete subclass: filtert koffie, voegt melk en suiker toe
- `Tea` — concrete subclass: laat thee trekken, voegt citroen toe

### Structuur

```
template-method/
  hotBeverage.ts              # Abstract class met template method
  coffee.ts                   # Concrete subclass: koffie
  tea.ts                      # Concrete subclass: thee
  main.ts                     # Demo
```

### Uitvoeren

```bash
npm run template-method
```

### Kernprincipe

> Definieer het skelet van een algoritme in een methode en laat subclasses bepaalde stappen invullen. De structuur verandert niet, alleen de details.

---

## English

The Template Method pattern is a behavioral pattern that defines the skeleton of an algorithm in a base class, while subclasses fill in specific steps without changing the structure.

### The problem

Coffee and tea are prepared almost the same way: boil water, brew, pour in cup, add condiments. But the details of "brewing" and "condiments" differ. Without this pattern you duplicate the common steps in each class.

### The solution

Define the **algorithm skeleton** in an abstract class (`HotBeverage`) with a `prepareRecipe()` method that locks in the order. The steps that vary (`brew()` and `addCondiments()`) are abstract — subclasses fill them in.

- `HotBeverage` — abstract class with template method `prepareRecipe()`
- `Coffee` — concrete subclass: filters coffee, adds milk and sugar
- `Tea` — concrete subclass: steeps tea, adds lemon

### Structure

```
template-method/
  hotBeverage.ts              # Abstract class with template method
  coffee.ts                   # Concrete subclass: coffee
  tea.ts                      # Concrete subclass: tea
  main.ts                     # Demo
```

### Run

```bash
npm run template-method
```

### Core principle

> Define the skeleton of an algorithm in a method and let subclasses fill in certain steps. The structure doesn't change, only the details.
