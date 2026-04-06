# Migration

Migratie-tool voor het overzetten van data uit bronsystemen (Podozorg, Podomasters, LFT) naar het nieuwe platform. Leest bronbestanden (JSON, INI), valideert, transformeert en schrijft CSV-bestanden als output.

## Quickstart

```bash
npm install
npm start
```

Output verschijnt in `output/` (CSV-bestanden) en `logs/` (logbestand).

## Architectuur

### Pipeline-patroon

Elke entiteit (tenants, patients, etc.) heeft een eigen **pipeline** die dezelfde vier stappen doorloopt:

```
┌─────────┐    ┌────────────┐    ┌──────────────┐    ┌────────┐
│  Reader  │───>│  Validator  │───>│  Transformer  │───>│  Writer │
└─────────┘    └────────────┘    └──────────────┘    └────────┘
   Bron-         Controle op       Mapping naar         CSV
   bestand       verplichte        doelmodel            output
   inlezen       velden
```

De `Migration` class orkestreert de pipelines per bron:

```
Migration.start()
       │
       ▼
 ┌──────────────┐
 │  runPodozorg  │
 └──────┬───────┘
        │
        ├──> TenantPipeline.run()
        │         │
        │         ├── JsonReader ── TenantValidator ── TenantTransformer ── CsvWriter
        │         │                                           │
        │         │                              ┌────────────┘
        │         │                              ▼
        │         │                     MigrationStore
        │         │                  (slaat tenant_ref op)
        │
        ├──> PatientPipeline.run()
        │         │
        │         ├── IniReader ── AuftragValidator ── PatientTransformer ── CsvWriter
        │         │                                           │
        │         │                              ┌────────────┘
        │         │                              ▼
        │         │                     MigrationStore
        │         │              (leest tenant_ref, genereert patient_number)
        │
        └──> MigrationStore.save()
```

### Mapstructuur

```
src/
├── index.ts                          # Entry point
│
├── core/                             # Framework & gedeelde infrastructuur
│   ├── migration.ts                  #   Orchestrator
│   ├── migration-store.ts            #   Cross-entiteit state (tenant refs, patient nummers)
│   └── logger.ts                     #   Logging naar bestand + summary
│
├── configs/                          # Configuratie per bron
│   └── podozorg.config.ts
│
├── models/                           # Interfaces & types
│   ├── pipeline.interface.ts         #   MigrationPipeline contract
│   ├── migration-config.interface.ts #   Config shape
│   ├── tenant-json.interface.ts      #   Bronmodel tenants (JSON)
│   ├── auftrag-ini.interface.ts      #   Bronmodel patients (INI)
│   ├── patient-migration.ts          #   Doelmodel patient
│   └── generated.ts                  #   GraphQL generated types (Tenant, Patient, enums)
│
├── pipelines/                        # Per-entiteit orchestratie
│   ├── tenant-pipeline.ts
│   └── patient-pipeline.ts
│
├── readers/                          # Bronbestanden inlezen
│   ├── file-reader.ts                #   Abstract base (bestands-check + buffer)
│   ├── json-reader.ts                #   JSON met BOM-stripping
│   └── ini-reader.ts                 #   INI met UTF-8/UTF-16LE detectie
│
├── transformers/                     # Data mapping naar doelmodel
│   ├── transformer.ts                #   Abstract base
│   ├── tenant-transformer.ts         #   TenantJson[] -> Tenant[] (hierarchische tenant_ref)
│   └── patient-transformer.ts        #   AuftragIni -> Patient (datum, gender, titel mapping)
│
├── validators/                       # Validatie van brondata
│   ├── validator.ts                  #   Abstract base
│   ├── ini-validator.ts              #   Abstract INI-specifieke validatie
│   ├── tenant-validator.ts           #   Verplichte velden in tenant JSON
│   └── auftrag-validator.ts          #   Verplichte secties/velden in Auftrag INI
│
└── writers/                          # Output generatie
    ├── writer.ts                     #   Abstract base
    └── csv-writer.ts                 #   CSV met ; delimiter
```

## Dataflow

### Tenants

```
podozorg/data/json/tenants-data.json
        │
        ▼
   ┌─────────┐     Velden:
   │  Bron    │     tenantObseleteID, tenantName, parentTenantObseleteID,
   │  (JSON)  │     city, street, postalCode, workshops...
   └────┬────┘
        │
        ▼
   ┌──────────┐
   │ Validatie │──── Verplichte velden aanwezig?
   └────┬─────┘     Nee ──> warn + stop
        │
        ▼
   ┌──────────────┐
   │ Transformatie │──── Bouwt hierarchische tenant_ref (parent.child)
   └────┬─────────┘     Mapt workshop referenties
        │
        ▼
  output/tenants.csv
```

### Patients

```
podozorg/data/ini/*_Auftrag.ini     (meerdere bestanden)
        │
        ▼                    Per bestand:
   ┌─────────┐
   │  Bron    │     Secties: Auftrag, Kunde, Versand,
   │  (INI)   │     Versandadresse, Einlagentyp, Diagnose, Fusstyp, Werkstatt
   └────┬────┘
        │
        ▼
   ┌──────────┐
   │ Validatie │──── Alle secties + verplichte velden aanwezig?
   └────┬─────┘     Nee ──> warn + skip dit bestand
        │
        ▼
   ┌──────────────┐
   │ Transformatie │──── Zoekt tenant_ref op via MigrationStore
   └────┬─────────┘     Genereert patient_number (M-100, M-101, ...)
        │               Mapt DD.MM.YYYY -> YYYY-MM-DD
        │               Mapt ANREDE/TITEL -> gender + title enums
        │               Genereert search_terms
        ▼
  output/patients.csv
```

## MigrationStore

De `MigrationStore` beheert state die gedeeld wordt tussen pipelines:

```
TenantPipeline                              PatientPipeline
      │                                           │
      │  setTenantRef("123", "org.practice")      │  getTenantRef("123")
      │                                           │  -> "org.practice"
      └──────────> MigrationStore <────────────────┘
                        │
                        │  getPatientNumber("podozorg-P001", "123")
                        │  -> "M-100"  (idempotent, counter per tenant)
                        │
                        ▼
               output/patient-numbers.json
               (persistente state voor herhaalde runs)
```

## Nieuwe pipeline toevoegen

1. Maak een reader, validator en transformer aan voor de entiteit
2. Maak `src/pipelines/<entiteit>-pipeline.ts` die `MigrationPipeline` implementeert
3. Voeg de pipeline toe aan de array in `Migration.runPodozorg()`:

```typescript
const pipelines: MigrationPipeline[] = [
  new TenantPipeline(),
  new PatientPipeline(),
  new NieuwePipeline(),  // <-- toevoegen
];
```

## Configuratie

Elke bron heeft een config in `src/configs/`:

| Veld        | Beschrijving                    | Voorbeeld          |
|-------------|--------------------------------|---------------------|
| `source`    | Bronsysteem                    | `"podozorg"`        |
| `inputDir`  | Basis input directory          | `"podozorg/data"`   |
| `iniDir`    | Map met INI-bestanden          | `"podozorg/data/ini"` |
| `jsonDir`   | Map met JSON-bestanden         | `"podozorg/data/json"` |
| `outputDir` | Output directory voor CSV's    | `"output"`          |

## Output

| Bestand                       | Beschrijving                                    |
|------------------------------|-------------------------------------------------|
| `output/tenants.csv`         | Getransformeerde tenant data (`;` delimiter)    |
| `output/patients.csv`        | Getransformeerde patient data (`;` delimiter)   |
| `output/patient-numbers.json`| Persistente state: counters + assignments       |
| `logs/migration.log`         | Timestamped log met info/warn/error regels      |
