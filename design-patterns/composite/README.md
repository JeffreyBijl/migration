# Composite Pattern

## Nederlands

Het Composite pattern is een structureel patroon dat objecten organiseert in boomstructuren. Individuele objecten en samengestelde objecten worden op dezelfde manier behandeld.

### Het probleem

Een bestandssysteem heeft bestanden en mappen. Een map kan andere mappen en bestanden bevatten. Je wilt bewerkingen (zoals grootte berekenen of de structuur printen) op dezelfde manier uitvoeren, ongeacht of je met een enkel bestand of een hele mappenstructuur werkt.

### De oplossing

Definieer een **Component** interface die zowel door bladeren (bestanden) als composieten (mappen) wordt geïmplementeerd. Een `Directory` bevat een lijst van `FileSystemComponent`-kinderen en delegeert bewerkingen recursief.

- `FileSystemComponent` — interface met `getName()`, `getSize()`, `print()`
- `File` — leaf: heeft een naam en grootte
- `Directory` — composite: bevat kinderen, `getSize()` sommeert recursief

### Structuur

```
composite/
  fileSystemComponent.ts      # Component interface
  file.ts                     # Leaf: bestand
  directory.ts                # Composite: map met kinderen
  main.ts                     # Demo
```

### Uitvoeren

```bash
npm run composite
```

### Kernprincipe

> Stel objecten samen in boomstructuren en behandel individuele objecten en samenstellingen op dezelfde manier. De client hoeft geen onderscheid te maken tussen een blad en een tak.

---

## English

The Composite pattern is a structural pattern that organizes objects into tree structures. Individual objects and compositions are treated the same way.

### The problem

A file system has files and directories. A directory can contain other directories and files. You want to perform operations (like calculating size or printing the structure) the same way regardless of whether you're dealing with a single file or an entire directory tree.

### The solution

Define a **Component** interface implemented by both leaves (files) and composites (directories). A `Directory` contains a list of `FileSystemComponent` children and delegates operations recursively.

- `FileSystemComponent` — interface with `getName()`, `getSize()`, `print()`
- `File` — leaf: has a name and size
- `Directory` — composite: contains children, `getSize()` sums recursively

### Structure

```
composite/
  fileSystemComponent.ts      # Component interface
  file.ts                     # Leaf: file
  directory.ts                # Composite: directory with children
  main.ts                     # Demo
```

### Run

```bash
npm run composite
```

### Core principle

> Compose objects into tree structures and treat individual objects and compositions uniformly. The client doesn't need to distinguish between a leaf and a branch.
