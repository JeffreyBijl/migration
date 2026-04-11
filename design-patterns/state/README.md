# State Pattern

## Nederlands

Het State pattern is een gedragspatroon dat een object van gedrag laat veranderen wanneer zijn interne toestand verandert. Het object lijkt van class te wisselen.

### Het probleem

Een kauwgombal-automaat heeft verschillende toestanden: wachten op munt, munt geaccepteerd, kauwgombal verkocht, uitverkocht. Elke actie (munt invoeren, hendel draaien) moet anders reageren afhankelijk van de huidige toestand. Met if/else-ketens wordt dit snel onbeheersbaar.

### De oplossing

Definieer een **State** interface met alle mogelijke acties. Maak voor elke toestand een aparte class die deze interface implementeert. De automaat (context) delegeert acties naar het huidige state-object en wisselt van state wanneer nodig.

- `State` — interface met `insertCoin()`, `ejectCoin()`, `turnCrank()`, `dispense()`
- `NoCoinState` — wacht op munt
- `HasCoinState` — munt geaccepteerd, wacht op hendel
- `SoldState` — kauwgombal wordt uitgegeven
- `SoldOutState` — automaat is leeg
- `GumballMachine` — context die de huidige state bijhoudt

### Structuur

```
state/
  states/
    state.ts                  # State interface
    noCoinState.ts            # Wacht op munt
    hasCoinState.ts           # Heeft munt
    soldState.ts              # Verkoopt kauwgombal
    soldOutState.ts           # Uitverkocht
  gumballMachine.ts           # Context
  main.ts                     # Demo
```

### Uitvoeren

```bash
npm run state
```

### Kernprincipe

> Laat een object van gedrag veranderen wanneer zijn toestand verandert, door elke toestand te delegeren naar een apart state-object. Geen if/else-ketens meer.

---

## English

The State pattern is a behavioral pattern that lets an object change its behavior when its internal state changes. The object appears to change its class.

### The problem

A gumball machine has different states: waiting for coin, coin accepted, gumball sold, sold out. Every action (insert coin, turn crank) must respond differently depending on the current state. With if/else chains this quickly becomes unmanageable.

### The solution

Define a **State** interface with all possible actions. Create a separate class for each state that implements this interface. The machine (context) delegates actions to the current state object and switches state when needed.

- `State` — interface with `insertCoin()`, `ejectCoin()`, `turnCrank()`, `dispense()`
- `NoCoinState` — waiting for coin
- `HasCoinState` — coin accepted, waiting for crank
- `SoldState` — dispensing gumball
- `SoldOutState` — machine is empty
- `GumballMachine` — context that tracks current state

### Structure

```
state/
  states/
    state.ts                  # State interface
    noCoinState.ts            # Waiting for coin
    hasCoinState.ts           # Has coin
    soldState.ts              # Selling gumball
    soldOutState.ts           # Sold out
  gumballMachine.ts           # Context
  main.ts                     # Demo
```

### Run

```bash
npm run state
```

### Core principle

> Let an object change its behavior when its state changes, by delegating each state to a separate state object. No more if/else chains.
