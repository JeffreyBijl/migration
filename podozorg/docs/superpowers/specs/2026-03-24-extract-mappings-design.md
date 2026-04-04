# Extract Mappings Pre-Script Design

## Goal

A single pre-script that extracts all unique source values from Auftrag.ini and Therapieplan.ini files, matches them against existing enum/lookup tables in `iac/scripts/`, and produces both a review CSV and generated TypeScript mapping function per mapping.

## Script

All paths are relative to `pes-import-script/`.

`src/pre-scripts/extract-mappings.ts` — run via:

```bash
cd pes-import-script
node --experimental-strip-types src/pre-scripts/extract-mappings.ts
```

Supporting files:
- `src/pre-scripts/helpers/extract-mappings.helpers.ts` — parsing, matching, output logic
- `src/pre-scripts/extract-mappings.config.ts` — paths, regex, constants

## Data Flow

1. Load target enum lookup tables from `../../../../iac/scripts/` (4 levels up from `pes-import-script/`) — JSON + CSV files
2. Read all `*_Auftrag.ini` and `*_Therapieplan_Links.ini` / `*_Therapieplan_Rechts.ini` from `data/orders/` (UTF-16LE with BOM)
3. Per mapping: collect unique source values with frequency count
4. Preprocess source values: trim, strip trailing `// ...` comments (shared utility), apply mapping-specific normalization
5. Match source values against loaded lookups
6. Write output per mapping

## Preprocessing

Many INI fields contain trailing comments (e.g., `1.5           //  1.5`). A shared `stripIniComment(value)` helper strips everything after `//` and trims. This is applied before any matching.

The existing `mapDiagnose` also replaces underscores with spaces after comment stripping. Each mapping's specific preprocessing is noted in the mapping table below.

## Output

Per mapping two files in `output/pre-scripts/`:

### Review CSV (`{mappingName}.csv`)

Semicolon-delimited with headers:

```
source_value;frequency;suggested_enum;match_type
```

- `match_type`: `exact` (key match), `normalized` (lowercase match), `unmatched`

### Generated TypeScript (`{mappingName}.ts`)

A ready-to-use mapping function with embedded map:

```typescript
const MAP: Record<string, string> = {
  'normalized_source': 'ENUM_KEY',
  // UNMATCHED: 'unknown_value' (3 occurrences)
};

export function mapX(value: string | undefined): string {
  if (!value) return '';
  const normalized = value.trim().toLowerCase();
  return MAP[normalized] ?? '';
}
```

Unmatched values appear as comments for manual review.

### Console + Log

Summary per mapping to console and `output/pre-scripts/logs/extract-mappings-{timestamp}.log`:

```
mapCoreMaterial: 12 unique values, 10 matched, 2 unmatched
```

## Mappings

### Enum mappings (matched against iac/scripts lookups)

| Mapping | INI Source | Section.Field | Lookup Source | Lookup Access |
|---|---|---|---|---|
| mapElements | Therapieplan_*.ini | All `[Element*]` sections (Element, Element_1, Element_85, etc.) → `Name` field. Only where `Aktiv = ja`. | `../../../../iac/scripts/elements/elements.csv` | Match INI `Name` against CSV column `nl_NL` → output is CSV column `value` |
| mapGroundSolePattern | Auftrag.ini | [Werkstatt].Brandsohle | `../../../../iac/scripts/ground-sole-patterns/i18n/nl-NL.json` | `json.groundSolePatterns` — keys are enum values, `.name` is display name. Match against key or `.name`. |
| mapCoreMaterial | Auftrag.ini | [Werkstatt].Fraesmaterial | `../../../../iac/scripts/materials/i18n/nl-NL.json` | `json.materials` — keys are enum values, values are display names. Match against key or value. |
| mapTopCoverMaterial | Auftrag.ini | [Werkstatt].Bezug | `../../../../iac/scripts/topcovers/i18n/nl-NL.json` | `json.topcovers` — keys are enum values, values are display names. Match against key or value. |
| mapDiagnose | Auftrag.ini | [Diagnose].Diagnose | `../../../../iac/scripts/diagnoses/i18n/nl-NL.json` | `json.diagnoses` — keys are enum values, values are Dutch labels. Preprocessing: strip `//` suffix, replace `_` with space, lowercase. Validate coverage of existing implementation. |

### Hardcoded heuristic mappings

| Mapping | INI Source | Section.Field | Strategy |
|---|---|---|---|
| mapInsoleType | Auftrag.ini | [Einlagentyp].Typ | lowercase → UPPER_SNAKE_CASE suggestion |
| mapProductionMethod | Auftrag.ini | [Werkstatt].Bemerkungen_2 | Keyword detection ("3D PRINT" → THREE_D_PRINT, etc.) |
| mapFoottype | Auftrag.ini | [Fusstyp].Typ | Existing: hohlfuss→CAVUS, normalfuss→RECTUS, plattfuss→PLANUS. Returns empty string for unknown. Validate coverage. |
| mapAnredeToGender | Auftrag.ini | [Kunde].ANREDE | Existing: Dhr→MALE, Mw→FEMALE. Returns UNKNOWN for unrecognized. Validate coverage. |

### Numeric value mappings

| Mapping | INI Source | Section.Field | Strategy |
|---|---|---|---|
| mapGroundSoleThickness | Therapieplan_*.ini | Three separate fields: `[Materialstaerke].Zehen`, `[Materialstaerke].Ballen`, `[Materialstaerke].Ferse`. Strip `//` comments before parsing. | Extract unique numeric values + min/max ranges per field. Generate parseFloat function. |
| mapRotation | Therapieplan_*.ini | Four sections: `[Supination_hindfoot].Hoehe`, `[Supination_forefoot].Hoehe`, `[Pronation_hindfoot].Hoehe`, `[Pronation_forefoot].Hoehe`. Strip `//` comments before parsing. | Extract unique values per section. Supination = positive, Pronation = negative. Generate parse function. |

## Matching Strategy

For enum mappings with a lookup table:

1. Try exact key match (source value is already the enum key)
2. Try normalized match: lowercase both source and lookup values/names
3. If no match: mark as `unmatched`

For hardcoded mappings: apply known translations, suggest UPPER_SNAKE_CASE for unknowns.

For existing mappings (mapDiagnose, mapFoottype, mapAnredeToGender): apply the same preprocessing as the existing implementation, then run extraction to validate that all source values are covered.

## File Structure

All paths relative to `pes-import-script/`:

```
src/pre-scripts/
  extract-mappings.ts              # Main script entry point
  extract-mappings.config.ts       # Paths, constants
  helpers/
    extract-mappings.helpers.ts    # INI parsing, lookup loading, matching, CSV/TS generation
output/pre-scripts/
  mapElements.csv
  mapElements.ts
  mapInsoleType.csv
  mapInsoleType.ts
  mapGroundSolePattern.csv
  mapGroundSolePattern.ts
  mapProductionMethod.csv
  mapProductionMethod.ts
  mapCoreMaterial.csv
  mapCoreMaterial.ts
  mapTopCoverMaterial.csv
  mapTopCoverMaterial.ts
  mapGroundSoleThickness.csv
  mapGroundSoleThickness.ts
  mapRotation.csv
  mapRotation.ts
  mapDiagnose.csv
  mapDiagnose.ts
  mapFoottype.csv
  mapFoottype.ts
  mapAnredeToGender.csv
  mapAnredeToGender.ts
  logs/
    extract-mappings-{timestamp}.log
```
