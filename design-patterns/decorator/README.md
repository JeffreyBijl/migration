# Decorator Pattern

## Nederlands

Het Decorator pattern is een structureel patroon waarbij je extra verantwoordelijkheden dynamisch aan een object toevoegt, zonder de class zelf aan te passen. Decorators wrappen het originele object en voegen gedrag toe via dezelfde interface.

### Het probleem

Een koffiezaak verkoopt verschillende basisdranken (espresso, house blend) met optionele toppings (melk, slagroom, karamel). Als je voor elke combinatie een aparte subclass maakt (`EspressoMetMelk`, `EspressoMetMelkEnSlagroom`, ...) ontploft het aantal classes exponentieel. En wat als er een nieuwe topping bijkomt?

### De oplossing

Definieer een `Beverage` interface met `getDescription()` en `getCost()`. Basisdranken implementeren deze interface direct. Toppings zijn **decorators**: ze implementeren dezelfde `Beverage` interface, maar wrappen een bestaande `Beverage`. Bij elke aanroep delegeren ze naar het gewrapte object en voegen hun eigen stuk toe.

- `Beverage` — de interface waar alles aan voldoet
- `Espresso`, `HouseBlend` — concrete basisdranken
- `ToppingDecorator` — abstracte decorator die een `Beverage` wrapt
- `Milk`, `WhippedCream`, `Caramel` — concrete decorators die prijs en beschrijving toevoegen

Omdat elke decorator zelf ook een `Beverage` **is**, kun je ze onbeperkt stapelen: dubbele karamel is gewoon twee keer wrappen.

### Structuur

```
beverages/
  beverage.ts               # Interface (component)
  espresso.ts               # Concrete component
  houseBlend.ts             # Concrete component
toppings/
  toppingDecorator.ts       # Abstracte decorator (wrapt een Beverage)
  milk.ts                   # Concrete decorator
  whippedCream.ts           # Concrete decorator
  caramel.ts                # Concrete decorator
main.ts                     # Demo: dranken samenstellen met toppings
```

### Uitvoeren

```bash
npm run decorator
```

### Kernprincipe

> Classes moeten open zijn voor uitbreiding, maar gesloten voor wijziging (Open/Closed Principle). Voeg gedrag toe door objecten te wrappen, niet door classes aan te passen.

---

## English

The Decorator pattern is a structural pattern that lets you dynamically attach additional responsibilities to an object, without modifying the class itself. Decorators wrap the original object and add behavior through the same interface.

### The problem

A coffee shop sells different base beverages (espresso, house blend) with optional toppings (milk, whipped cream, caramel). If you create a separate subclass for every combination (`EspressoWithMilk`, `EspressoWithMilkAndCream`, ...) the number of classes explodes exponentially. And what happens when a new topping is added?

### The solution

Define a `Beverage` interface with `getDescription()` and `getCost()`. Base beverages implement this interface directly. Toppings are **decorators**: they implement the same `Beverage` interface, but wrap an existing `Beverage`. On each call they delegate to the wrapped object and add their own part.

- `Beverage` — the interface everything conforms to
- `Espresso`, `HouseBlend` — concrete base beverages
- `ToppingDecorator` — abstract decorator that wraps a `Beverage`
- `Milk`, `WhippedCream`, `Caramel` — concrete decorators that add cost and description

Because each decorator **is** a `Beverage` itself, you can stack them indefinitely: double caramel is simply wrapping twice.

### Structure

```
beverages/
  beverage.ts               # Interface (component)
  espresso.ts               # Concrete component
  houseBlend.ts             # Concrete component
toppings/
  toppingDecorator.ts       # Abstract decorator (wraps a Beverage)
  milk.ts                   # Concrete decorator
  whippedCream.ts           # Concrete decorator
  caramel.ts                # Concrete decorator
main.ts                     # Demo: composing beverages with toppings
```

### Run

```bash
npm run decorator
```

### Core principle

> Classes should be open for extension but closed for modification (Open/Closed Principle). Add behavior by wrapping objects, not by modifying classes.
