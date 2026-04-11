# Factory Pattern

## Nederlands

Het Factory pattern is een creatief patroon waarbij je de verantwoordelijkheid voor het aanmaken van objecten weghaalt uit de aanroepende code. In plaats van direct `new Car()` aan te roepen, vraag je een factory om het juiste object voor je aan te maken. Er zijn twee varianten: de **Simple Factory** en de **Factory Method**.

### Het probleem

Een applicatie moet voertuigen aanmaken: auto's, motorfietsen en fietsen. Als je overal in de code `new Car()`, `new Motorcycle()` en `new Bicycle()` schrijft, is de aanroepende code direct afhankelijk van concrete implementaties. Voeg je een nieuw voertuigtype toe, dan moet je alle plekken in de code aanpassen.

### De oplossing

**Simple Factory** centraliseert het aanmaken in één klasse met een `createVehicle(type)` methode. De aanroepende code werkt alleen met de `Vehicle` interface en weet niets van de concrete klassen. Dit is geen officieel GoF-patroon, maar een veelgebruikte praktische aanpak.

**Factory Method** gaat een stap verder: een abstracte `VehicleStore` klasse definieert het algoritme voor het bestellen (`orderVehicle()`), maar laat de concrete subklassen bepalen welk voertuig er aangemaakt wordt via de abstracte `createVehicle()` methode. Zo kun je nieuwe voertuigtypes toevoegen door een nieuwe subklasse te maken, zonder de bestaande code aan te passen.

- `Vehicle` — de interface waar alle voertuigen aan voldoen
- `Car`, `Motorcycle`, `Bicycle` — concrete voertuigen
- `VehicleFactory` (Simple Factory) — centraliseert het aanmaken via `createVehicle(type)`
- `VehicleStore` (Factory Method) — abstracte creator met `orderVehicle()` en abstracte `createVehicle()`
- `CarStore`, `MotorcycleStore`, `BicycleStore` — concrete creators die bepalen welk voertuig aangemaakt wordt

### Structuur

```
vehicles/
  vehicle.ts              # Interface (component)
  car.ts                  # Concrete Vehicle
  motorcycle.ts           # Concrete Vehicle
  bicycle.ts              # Concrete Vehicle
simple-factory/
  vehicleFactory.ts       # Factory met createVehicle(type)
  main.ts                 # Demo
factory-method/
  vehicleStore.ts         # Abstracte creator met orderVehicle() + abstracte createVehicle()
  carStore.ts             # Concrete creator
  motorcycleStore.ts      # Concrete creator
  bicycleStore.ts         # Concrete creator
  main.ts                 # Demo
README.md
```

### Uitvoeren

```bash
npm run simple-factory
npm run factory-method
```

### Kernprincipe

> Programmeer naar een interface, niet naar een implementatie. Laat subklassen bepalen welke klasse geïnstantieerd wordt.

---

## English

The Factory pattern is a creational pattern that moves the responsibility of creating objects away from the calling code. Instead of calling `new Car()` directly, you ask a factory to create the right object for you. There are two variants: the **Simple Factory** and the **Factory Method**.

### The problem

An application needs to create vehicles: cars, motorcycles, and bicycles. If you write `new Car()`, `new Motorcycle()`, and `new Bicycle()` all over your code, the calling code is directly coupled to concrete implementations. Add a new vehicle type and you have to update every location in the code.

### The solution

**Simple Factory** centralizes creation in one class with a `createVehicle(type)` method. The calling code only works with the `Vehicle` interface and knows nothing about the concrete classes. This is not an official GoF pattern, but a widely used practical approach.

**Factory Method** goes one step further: an abstract `VehicleStore` class defines the algorithm for ordering (`orderVehicle()`), but lets concrete subclasses decide which vehicle to create via the abstract `createVehicle()` method. This allows you to add new vehicle types by creating a new subclass, without modifying existing code.

- `Vehicle` — the interface everything conforms to
- `Car`, `Motorcycle`, `Bicycle` — concrete vehicles
- `VehicleFactory` (Simple Factory) — centralizes creation via `createVehicle(type)`
- `VehicleStore` (Factory Method) — abstract creator with `orderVehicle()` and abstract `createVehicle()`
- `CarStore`, `MotorcycleStore`, `BicycleStore` — concrete creators that decide which vehicle is instantiated

### Structure

```
vehicles/
  vehicle.ts              # Interface (component)
  car.ts                  # Concrete Vehicle
  motorcycle.ts           # Concrete Vehicle
  bicycle.ts              # Concrete Vehicle
simple-factory/
  vehicleFactory.ts       # Factory with createVehicle(type)
  main.ts                 # Demo
factory-method/
  vehicleStore.ts         # Abstract creator with orderVehicle() + abstract createVehicle()
  carStore.ts             # Concrete creator
  motorcycleStore.ts      # Concrete creator
  bicycleStore.ts         # Concrete creator
  main.ts                 # Demo
README.md
```

### Run

```bash
npm run simple-factory
npm run factory-method
```

### Core principle

> Program to an interface, not an implementation. Let subclasses decide which class to instantiate.
