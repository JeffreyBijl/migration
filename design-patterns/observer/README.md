# Observer Pattern

## Nederlands

Het Observer pattern is een gedragspatroon waarbij een object (het **subject**) een lijst bijhoudt van afhankelijke objecten (**observers**) en hen automatisch op de hoogte stelt wanneer er iets verandert. De observers hoeven niet te weten wie het subject is, en het subject hoeft niet te weten wat de observers met de informatie doen.

### Het probleem

Een nieuwsagentschap moet berichten versturen naar verschillende kanalen: een app, email en website. Als het agentschap directe referenties heeft naar elk kanaal, moet je de `NewsAgency` class aanpassen telkens wanneer er een kanaal bijkomt of verdwijnt. Dat schaalt niet en maakt de code fragiel.

### De oplossing

Definieer twee rollen:

- **Subject** (`NewsAgency`) — houdt een lijst van observers bij en biedt methodes om te subscriben en unsubscriben. Wanneer er nieuws is, stuurt het dit door naar alle observers.
- **Observer** (de kanalen) — implementeert een `update()` methode die het nieuws ontvangt en verwerkt.

Het agentschap kent alleen de `Observer` interface, niet de concrete kanalen. Een nieuw kanaal toevoegen is gewoon een nieuwe class maken die `Observer` implementeert en subscriben — zonder de `NewsAgency` aan te passen.

### Structuur

```
observer.ts                   # Observer interface
subject.ts                    # Subject interface
newsAgency.ts                 # Het subject: houdt observers bij en publiceert nieuws
channels/
  appChannel.ts               # Push notificaties
  emailChannel.ts             # Email nieuwsbrief
  websiteChannel.ts           # Website banner
main.ts                       # Demo: subscriben, publiceren, unsubscriben
```

### Uitvoeren

```bash
npm run observer
```

### Kernprincipe

> Definieer een een-op-veel relatie tussen objecten, zodat wanneer het ene object verandert, alle afhankelijke objecten automatisch worden genotificeerd. Houd de koppeling los: het subject kent alleen de interface, niet de implementatie.

---

## English

The Observer pattern is a behavioral pattern where an object (the **subject**) maintains a list of dependent objects (**observers**) and automatically notifies them when something changes. The observers don't need to know who the subject is, and the subject doesn't need to know what the observers do with the information.

### The problem

A news agency needs to send messages to different channels: an app, email and website. If the agency holds direct references to each channel, you have to modify the `NewsAgency` class every time a channel is added or removed. That doesn't scale and makes the code fragile.

### The solution

Define two roles:

- **Subject** (`NewsAgency`) — maintains a list of observers and provides methods to subscribe and unsubscribe. When there's news, it forwards it to all observers.
- **Observer** (the channels) — implements an `update()` method that receives and processes the news.

The agency only knows the `Observer` interface, not the concrete channels. Adding a new channel is simply creating a new class that implements `Observer` and subscribing it — without modifying the `NewsAgency`.

### Structure

```
observer.ts                   # Observer interface
subject.ts                    # Subject interface
newsAgency.ts                 # The subject: manages observers and publishes news
channels/
  appChannel.ts               # Push notifications
  emailChannel.ts             # Email newsletter
  websiteChannel.ts           # Website banner
main.ts                       # Demo: subscribe, publish, unsubscribe
```

### Run

```bash
npm run observer
```

### Core principle

> Define a one-to-many relationship between objects, so that when one object changes, all dependent objects are automatically notified. Keep the coupling loose: the subject only knows the interface, not the implementation.
