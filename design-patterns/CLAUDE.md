# Design Patterns

## Code conventies

- Gebruik beschrijvende namen voor variabelen en methodes. Geen afkortingen of generieke namen (bijv. `updateObservers` in plaats van `notify`, `observer` in plaats van `o`).
- Gebruik altijd expliciet `public`, `protected` of `private` bij methodes en variabelen.
- Gebruik TypeScript parameter properties in constructors in plaats van handmatige assignments (bijv. `constructor(private name: string) {}` in plaats van `this.name = name`).
- Class volgorde (van meest open naar meest afgesloten):
  1. Public variabelen
  2. Protected variabelen
  3. Private variabelen
  4. Constructor
  5. Public methodes
  6. Protected methodes
  7. Private methodes
