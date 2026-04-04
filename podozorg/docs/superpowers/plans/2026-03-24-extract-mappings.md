# Extract Mappings Pre-Script Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pre-script that extracts unique source values from Auftrag.ini and Therapieplan.ini files, matches them against existing lookup tables, and outputs review CSVs + generated TypeScript mapping functions.

**Architecture:** Single entry-point script (`extract-mappings.ts`) that reads all INI files once, delegates to per-mapping extractors, and writes output. Config file holds all paths. Helper file contains all logic (INI parsing, lookup loading, matching, output generation).

**Tech Stack:** TypeScript (node --experimental-strip-types), `ini` package for INI parsing, `node:fs` for file I/O. Semicolon-delimited CSV output.

**Spec:** `docs/superpowers/specs/2026-03-24-extract-mappings-design.md`

**Working directory:** All commands run from `pes-import-script/` (i.e. `cd manual-scripts/migration/podozorg/pes-import-script`).

---

## File Structure

```
pes-import-script/
  src/pre-scripts/
    extract-mappings.ts              # Entry point
    extract-mappings.config.ts       # Paths and constants
    helpers/
      extract-mappings.helpers.ts    # All logic
  output/pre-scripts/               # Generated at runtime
```

---

### Task 1: Config file

**Files:**
- Create: `src/pre-scripts/extract-mappings.config.ts`

- [ ] **Step 1: Create the config file**

```typescript
import path from 'node:path';

export const ORDERS_DATA_PATH = path.resolve('data/orders');

export const AUFTRAG_FILENAME_REGEX = /^\d{8}_\d{6}_.*_Auftrag\.ini$/;
export const THERAPIEPLAN_LINKS_REGEX = /^\d{8}_\d{6}_.*_Therapieplan_Links\.ini$/;
export const THERAPIEPLAN_RECHTS_REGEX = /^\d{8}_\d{6}_.*_Therapieplan_Rechts\.ini$/;

export const PRE_SCRIPTS_OUTPUT_PATH = path.resolve('output/pre-scripts');

// Lookup table paths (relative to pes-import-script/)
export const ELEMENTS_CSV_PATH = path.resolve('../../../../iac/scripts/elements/elements.csv');
export const GROUND_SOLE_PATTERNS_JSON_PATH = path.resolve('../../../../iac/scripts/ground-sole-patterns/i18n/nl-NL.json');
export const MATERIALS_JSON_PATH = path.resolve('../../../../iac/scripts/materials/i18n/nl-NL.json');
export const TOPCOVERS_JSON_PATH = path.resolve('../../../../iac/scripts/topcovers/i18n/nl-NL.json');
export const DIAGNOSES_JSON_PATH = path.resolve('../../../../iac/scripts/diagnoses/i18n/nl-NL.json');

export const PROGRESS_LOG_INTERVAL = 500;
```

- [ ] **Step 2: Commit**

```bash
git add src/pre-scripts/extract-mappings.config.ts
git commit -m "feat: add extract-mappings config file"
```

---

### Task 2: Complete helper file

**Files:**
- Create: `src/pre-scripts/helpers/extract-mappings.helpers.ts`

This is the full helper file with all imports at the top, followed by: types, INI parsing, lookup loaders, value extractors, matching, and output generation.

- [ ] **Step 1: Create the complete helper file**

```typescript
import fs from 'node:fs';
import path from 'node:path';
import ini from 'ini';
import {
  ORDERS_DATA_PATH,
  AUFTRAG_FILENAME_REGEX,
  THERAPIEPLAN_LINKS_REGEX,
  THERAPIEPLAN_RECHTS_REGEX,
  ELEMENTS_CSV_PATH,
  GROUND_SOLE_PATTERNS_JSON_PATH,
  MATERIALS_JSON_PATH,
  TOPCOVERS_JSON_PATH,
  DIAGNOSES_JSON_PATH,
  PRE_SCRIPTS_OUTPUT_PATH,
  PROGRESS_LOG_INTERVAL,
} from '../extract-mappings.config.ts';

// --- Types ---

export interface MappingResult {
  name: string;
  entries: Map<string, number>;
  matches: Map<string, { enum: string; matchType: 'exact' | 'normalized' }>;
}

// --- INI parsing ---

export function stripIniComment(value: string): string {
  return value.replace(/\/\/.*$/, '').trim();
}

export function readIniFile(filePath: string): Record<string, Record<string, string>> {
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString('utf16le').replace(/^\uFEFF/, '');
  return ini.parse(content);
}

export function listOrderFiles(regex: RegExp): string[] {
  const files = fs.readdirSync(ORDERS_DATA_PATH, 'utf-8');
  return files.filter((file) => regex.test(file)).sort();
}

export function readAllAuftragFiles(): Record<string, Record<string, string>>[] {
  const files = listOrderFiles(AUFTRAG_FILENAME_REGEX);
  const results: Record<string, Record<string, string>>[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      results.push(readIniFile(path.join(ORDERS_DATA_PATH, files[i])));
    } catch (error) {
      console.error(`Failed to parse ${files[i]}: ${error instanceof Error ? error.message : error}`);
    }

    if ((i + 1) % PROGRESS_LOG_INTERVAL === 0) {
      console.log(`  Parsed ${i + 1}/${files.length} Auftrag files...`);
    }
  }

  return results;
}

export function readAllTherapieplanFiles(): Record<string, Record<string, string>>[] {
  const linksFiles = listOrderFiles(THERAPIEPLAN_LINKS_REGEX);
  const rechtsFiles = listOrderFiles(THERAPIEPLAN_RECHTS_REGEX);
  const allFiles = [...linksFiles, ...rechtsFiles].sort();
  const results: Record<string, Record<string, string>>[] = [];

  for (let i = 0; i < allFiles.length; i++) {
    try {
      results.push(readIniFile(path.join(ORDERS_DATA_PATH, allFiles[i])));
    } catch (error) {
      console.error(`Failed to parse ${allFiles[i]}: ${error instanceof Error ? error.message : error}`);
    }

    if ((i + 1) % PROGRESS_LOG_INTERVAL === 0) {
      console.log(`  Parsed ${i + 1}/${allFiles.length} Therapieplan files...`);
    }
  }

  return results;
}

// --- Lookup loaders ---

/** Loads elements.csv: builds reverse map from lowercase nl_NL -> value (enum key) */
export function loadElementsLookup(): Map<string, string> {
  const content = fs.readFileSync(ELEMENTS_CSV_PATH, 'utf-8');
  const lines = content.split('\n').filter((line) => line.trim());
  const headers = lines[0].split(';');

  const valueIndex = headers.indexOf('value');
  const nlIndex = headers.indexOf('nl_NL');

  const lookup = new Map<string, string>();

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(';');
    const value = columns[valueIndex]?.trim();
    const nlNL = columns[nlIndex]?.trim();
    if (value && nlNL) {
      lookup.set(nlNL.toLowerCase(), value);
    }
  }

  return lookup;
}

/** Loads a JSON lookup file with shape { rootKey: { ENUM: "display name" } } */
function loadSimpleJsonLookup(filePath: string, rootKey: string): Map<string, string> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  const data: Record<string, string> = json[rootKey];

  const lookup = new Map<string, string>();

  for (const [enumKey, displayName] of Object.entries(data)) {
    lookup.set(enumKey.toLowerCase(), enumKey);
    if (typeof displayName === 'string') {
      lookup.set(displayName.toLowerCase(), enumKey);
    }
  }

  return lookup;
}

/** Loads ground-sole-patterns: { groundSolePatterns: { ENUM: { name: "display" } } } */
export function loadGroundSolePatternsLookup(): Map<string, string> {
  const content = fs.readFileSync(GROUND_SOLE_PATTERNS_JSON_PATH, 'utf-8');
  const json = JSON.parse(content);
  const data: Record<string, { name: string }> = json.groundSolePatterns;

  const lookup = new Map<string, string>();

  for (const [enumKey, obj] of Object.entries(data)) {
    lookup.set(enumKey.toLowerCase(), enumKey);
    if (obj.name) {
      lookup.set(obj.name.toLowerCase(), enumKey);
    }
  }

  return lookup;
}

export function loadMaterialsLookup(): Map<string, string> {
  return loadSimpleJsonLookup(MATERIALS_JSON_PATH, 'materials');
}

export function loadTopcoversLookup(): Map<string, string> {
  return loadSimpleJsonLookup(TOPCOVERS_JSON_PATH, 'topcovers');
}

export function loadDiagnosesLookup(): Map<string, string> {
  return loadSimpleJsonLookup(DIAGNOSES_JSON_PATH, 'diagnoses');
}

// --- Value extractors ---

function addValue(map: Map<string, number>, value: string | undefined): void {
  if (!value || !value.trim()) return;
  const cleaned = stripIniComment(value).trim();
  if (!cleaned) return;
  map.set(cleaned, (map.get(cleaned) ?? 0) + 1);
}

/** Extract active element Names from all Therapieplan files */
export function extractElements(therapieplans: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();

  for (const parsed of therapieplans) {
    for (const [section, fields] of Object.entries(parsed)) {
      if (!section.startsWith('Element')) continue;
      const aktiv = stripIniComment(fields['Aktiv'] ?? '').toLowerCase();
      if (aktiv !== 'ja') continue;
      addValue(values, fields['Name']);
    }
  }

  return values;
}

/** Extract [Einlagentyp].Typ from Auftrag files */
export function extractInsoleType(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    addValue(values, parsed['Einlagentyp']?.['Typ']);
  }
  return values;
}

/** Extract [Werkstatt].Brandsohle from Auftrag files */
export function extractGroundSolePattern(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    addValue(values, parsed['Werkstatt']?.['Brandsohle']);
  }
  return values;
}

/** Extract [Werkstatt].Bemerkungen_2 from Auftrag files */
export function extractProductionMethod(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    addValue(values, parsed['Werkstatt']?.['Bemerkungen_2']);
  }
  return values;
}

/** Extract [Werkstatt].Fraesmaterial from Auftrag files */
export function extractCoreMaterial(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    addValue(values, parsed['Werkstatt']?.['Fraesmaterial']);
  }
  return values;
}

/** Extract [Werkstatt].Bezug from Auftrag files */
export function extractTopCoverMaterial(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    addValue(values, parsed['Werkstatt']?.['Bezug']);
  }
  return values;
}

/** Extract [Materialstaerke] fields from Therapieplan files */
export function extractGroundSoleThickness(therapieplans: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of therapieplans) {
    const section = parsed['Materialstaerke'];
    if (!section) continue;
    for (const field of ['Zehen', 'Ballen', 'Ferse']) {
      addValue(values, section[field]);
    }
  }
  return values;
}

/** Extract Supination/Pronation Hoehe from Therapieplan files */
export function extractRotation(therapieplans: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  const sections = ['Supination_hindfoot', 'Supination_forefoot', 'Pronation_hindfoot', 'Pronation_forefoot'];
  for (const parsed of therapieplans) {
    for (const section of sections) {
      addValue(values, parsed[section]?.['Hoehe']);
    }
  }
  return values;
}

/** Extract [Diagnose].Diagnose from Auftrag files (strip // suffix, replace _ with space) */
export function extractDiagnose(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    const raw = parsed['Diagnose']?.['Diagnose'];
    if (!raw || !raw.trim()) continue;
    const stripped = raw.replace(/\/\/.*$/, '').trim();
    if (!stripped) continue;
    const normalized = stripped.replace(/_/g, ' ');
    values.set(normalized, (values.get(normalized) ?? 0) + 1);
  }
  return values;
}

/** Extract [Fusstyp].Typ from Auftrag files */
export function extractFoottype(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    addValue(values, parsed['Fusstyp']?.['Typ']);
  }
  return values;
}

/** Extract [Kunde].ANREDE from Auftrag files */
export function extractAnredeToGender(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    addValue(values, parsed['Kunde']?.['ANREDE']);
  }
  return values;
}

// --- Matching ---

export function matchAgainstLookup(
  name: string,
  values: Map<string, number>,
  lookup: Map<string, string>,
): MappingResult {
  const matches = new Map<string, { enum: string; matchType: 'exact' | 'normalized' }>();

  for (const [sourceValue] of values) {
    const exactMatch = lookup.get(sourceValue);
    if (exactMatch) {
      matches.set(sourceValue, { enum: exactMatch, matchType: 'exact' });
      continue;
    }

    const normalizedMatch = lookup.get(sourceValue.toLowerCase());
    if (normalizedMatch) {
      matches.set(sourceValue, { enum: normalizedMatch, matchType: 'normalized' });
    }
  }

  return { name, entries: values, matches };
}

export function matchWithHardcoded(
  name: string,
  values: Map<string, number>,
  knownMappings: Record<string, string>,
): MappingResult {
  const matches = new Map<string, { enum: string; matchType: 'exact' | 'normalized' }>();

  for (const [sourceValue] of values) {
    const normalized = sourceValue.trim().toLowerCase();
    const known = knownMappings[normalized];
    if (known) {
      matches.set(sourceValue, { enum: known, matchType: 'normalized' });
    }
  }

  return { name, entries: values, matches };
}

// --- Output generation ---

export function writeMappingCsv(result: MappingResult): void {
  const dir = PRE_SCRIPTS_OUTPUT_PATH;
  fs.mkdirSync(dir, { recursive: true });

  const header = 'source_value;frequency;suggested_enum;match_type';
  const rows: string[] = [header];

  const sorted = [...result.entries.entries()].sort((a, b) => b[1] - a[1]);

  for (const [sourceValue, frequency] of sorted) {
    const match = result.matches.get(sourceValue);
    const suggestedEnum = match?.enum ?? '';
    const matchType = match?.matchType ?? 'unmatched';
    rows.push(`${sourceValue};${frequency};${suggestedEnum};${matchType}`);
  }

  fs.writeFileSync(path.join(dir, `${result.name}.csv`), rows.join('\n') + '\n', 'utf-8');
}

export function writeMappingTs(functionName: string, result: MappingResult, fallback: string = "''"): void {
  const dir = PRE_SCRIPTS_OUTPUT_PATH;
  fs.mkdirSync(dir, { recursive: true });

  const sorted = [...result.entries.entries()].sort((a, b) => b[1] - a[1]);

  const mapEntries: string[] = [];
  for (const [sourceValue, frequency] of sorted) {
    const match = result.matches.get(sourceValue);
    if (match) {
      mapEntries.push(`  '${sourceValue.toLowerCase()}': '${match.enum}',`);
    } else {
      mapEntries.push(`  // UNMATCHED: '${sourceValue.toLowerCase()}' (${frequency} occurrences)`);
    }
  }

  const constName = functionName.replace(/^map/, '').replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '') + '_MAP';

  const code = [
    `const ${constName}: Record<string, string> = {`,
    ...mapEntries,
    `};`,
    ``,
    `export function ${functionName}(value: string | undefined): string {`,
    `  if (!value) return '';`,
    `  const normalized = value.trim().toLowerCase();`,
    `  return ${constName}[normalized] ?? ${fallback};`,
    `}`,
    ``,
  ].join('\n');

  fs.writeFileSync(path.join(dir, `${result.name}.ts`), code, 'utf-8');
}

export function buildSummaryLine(result: MappingResult): string {
  const total = result.entries.size;
  const matched = result.matches.size;
  const unmatched = total - matched;
  return `${result.name}: ${total} unique values, ${matched} matched, ${unmatched} unmatched`;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `node --experimental-strip-types -e "import('./src/pre-scripts/helpers/extract-mappings.helpers.ts').then(() => console.log('OK'))"`
Expected: `OK`

- [ ] **Step 3: Verify lookup loaders work**

Run: `node --experimental-strip-types -e "import('./src/pre-scripts/helpers/extract-mappings.helpers.ts').then(m => { console.log('elements:', m.loadElementsLookup().size); console.log('gsp:', m.loadGroundSolePatternsLookup().size); console.log('materials:', m.loadMaterialsLookup().size); console.log('topcovers:', m.loadTopcoversLookup().size); console.log('diagnoses:', m.loadDiagnosesLookup().size); })"`
Expected: Numbers > 0 for each lookup.

- [ ] **Step 4: Commit**

```bash
git add src/pre-scripts/helpers/extract-mappings.helpers.ts
git commit -m "feat: add extract-mappings helpers with parsing, lookups, extractors, and output generation"
```

---

### Task 3: Main entry point script

**Files:**
- Create: `src/pre-scripts/extract-mappings.ts`

- [ ] **Step 1: Create the main script**

```typescript
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  readAllAuftragFiles,
  readAllTherapieplanFiles,
  loadElementsLookup,
  loadGroundSolePatternsLookup,
  loadMaterialsLookup,
  loadTopcoversLookup,
  loadDiagnosesLookup,
  extractElements,
  extractInsoleType,
  extractGroundSolePattern,
  extractProductionMethod,
  extractCoreMaterial,
  extractTopCoverMaterial,
  extractGroundSoleThickness,
  extractRotation,
  extractDiagnose,
  extractFoottype,
  extractAnredeToGender,
  matchAgainstLookup,
  matchWithHardcoded,
  writeMappingCsv,
  writeMappingTs,
  buildSummaryLine,
} from './helpers/extract-mappings.helpers.ts';
import type { MappingResult } from './helpers/extract-mappings.helpers.ts';
import { PRE_SCRIPTS_OUTPUT_PATH } from './extract-mappings.config.ts';

// --- Load lookups ---
console.log('Loading lookup tables...');
const elementsLookup = loadElementsLookup();
console.log(`  elements: ${elementsLookup.size} entries`);
const gspLookup = loadGroundSolePatternsLookup();
console.log(`  ground-sole-patterns: ${gspLookup.size} entries`);
const materialsLookup = loadMaterialsLookup();
console.log(`  materials: ${materialsLookup.size} entries`);
const topcoversLookup = loadTopcoversLookup();
console.log(`  topcovers: ${topcoversLookup.size} entries`);
const diagnosesLookup = loadDiagnosesLookup();
console.log(`  diagnoses: ${diagnosesLookup.size} entries`);

// --- Read INI files ---
console.log('\nReading Auftrag.ini files...');
const auftrags = readAllAuftragFiles();
console.log(`Parsed ${auftrags.length} Auftrag files`);

console.log('Reading Therapieplan files...');
const therapieplans = readAllTherapieplanFiles();
console.log(`Parsed ${therapieplans.length} Therapieplan files`);

// --- Hardcoded mappings ---
const HARDCODED_FOOTTYPE: Record<string, string> = {
  hohlfuss: 'CAVUS',
  normalfuss: 'RECTUS',
  plattfuss: 'PLANUS',
};

const HARDCODED_GENDER: Record<string, string> = {
  dhr: 'MALE',
  mw: 'FEMALE',
};

const HARDCODED_PRODUCTION_METHOD: Record<string, string> = {
  '3d print': 'THREE_D_PRINT',
};

// --- Mapping definitions ---
interface MappingDefinition {
  name: string;
  functionName: string;
  values: Map<string, number>;
  lookup?: Map<string, string>;
  hardcoded?: Record<string, string>;
  fallback?: string;
}

const mappings: MappingDefinition[] = [
  { name: 'mapElements', functionName: 'mapElements', values: extractElements(therapieplans), lookup: elementsLookup },
  { name: 'mapInsoleType', functionName: 'mapInsoleType', values: extractInsoleType(auftrags) },
  { name: 'mapGroundSolePattern', functionName: 'mapGroundSolePattern', values: extractGroundSolePattern(auftrags), lookup: gspLookup },
  { name: 'mapProductionMethod', functionName: 'mapProductionMethod', values: extractProductionMethod(auftrags), hardcoded: HARDCODED_PRODUCTION_METHOD },
  { name: 'mapCoreMaterial', functionName: 'mapCoreMaterial', values: extractCoreMaterial(auftrags), lookup: materialsLookup },
  { name: 'mapTopCoverMaterial', functionName: 'mapTopCoverMaterial', values: extractTopCoverMaterial(auftrags), lookup: topcoversLookup },
  { name: 'mapGroundSoleThickness', functionName: 'mapGroundSoleThickness', values: extractGroundSoleThickness(therapieplans) },
  { name: 'mapRotation', functionName: 'mapRotation', values: extractRotation(therapieplans) },
  { name: 'mapDiagnose', functionName: 'mapDiagnose', values: extractDiagnose(auftrags), lookup: diagnosesLookup },
  { name: 'mapFoottype', functionName: 'mapFoottype', values: extractFoottype(auftrags), hardcoded: HARDCODED_FOOTTYPE },
  { name: 'mapAnredeToGender', functionName: 'mapAnredeToGender', values: extractAnredeToGender(auftrags), hardcoded: HARDCODED_GENDER, fallback: "'UNKNOWN'" },
];

// --- Extract, match, and write ---
console.log('\nExtracting and matching values...\n');

const logLines: string[] = [];

for (const mapping of mappings) {
  let result: MappingResult;
  if (mapping.lookup) {
    result = matchAgainstLookup(mapping.name, mapping.values, mapping.lookup);
  } else if (mapping.hardcoded) {
    result = matchWithHardcoded(mapping.name, mapping.values, mapping.hardcoded);
  } else {
    result = { name: mapping.name, entries: mapping.values, matches: new Map() };
  }

  writeMappingCsv(result);
  writeMappingTs(mapping.functionName, result, mapping.fallback);

  const summary = buildSummaryLine(result);
  console.log(summary);
  logLines.push(summary);
}

// --- Write log ---
const logDir = `${PRE_SCRIPTS_OUTPUT_PATH}/logs`;
mkdirSync(logDir, { recursive: true });
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
writeFileSync(`${logDir}/extract-mappings-${timestamp}.log`, logLines.join('\n') + '\n');

console.log(`\nDone. Output written to ${PRE_SCRIPTS_OUTPUT_PATH}/`);
```

- [ ] **Step 2: Run the script**

Run: `node --experimental-strip-types src/pre-scripts/extract-mappings.ts`
Expected: Summary output showing unique values and match counts per mapping. CSV and TS files in `output/pre-scripts/`.

- [ ] **Step 3: Verify output files exist**

Run: `ls output/pre-scripts/`
Expected: 22 files (11 CSVs + 11 TSs) plus `logs/` directory.

- [ ] **Step 4: Spot-check a CSV**

Run: `head -5 output/pre-scripts/mapCoreMaterial.csv`
Expected: Header row + data rows with source values, frequencies, and suggested enums.

- [ ] **Step 5: Spot-check a TS file**

Run: `head -10 output/pre-scripts/mapCoreMaterial.ts`
Expected: A `const CORE_MATERIAL_MAP` with mapping entries.

- [ ] **Step 6: Spot-check element matching**

Run: `head -5 output/pre-scripts/mapElements.csv`
Verify that INI element `Name` values (like `SA-1`, `Kuip-Rectus`) match against the `nl_NL` column in elements.csv (like `Sa-1`, `Kuip-Rectus`). If match rate is very low, the matching strategy may need adjustment.

- [ ] **Step 7: Commit**

```bash
git add src/pre-scripts/extract-mappings.ts
git commit -m "feat: add extract-mappings main script"
```

---

### Task 4: Smoke test and validate

- [ ] **Step 1: Run the full script and review output**

Run: `node --experimental-strip-types src/pre-scripts/extract-mappings.ts`

Check the console summary. For each mapping, verify:
- The number of unique values is reasonable (not 0, not suspiciously low)
- The match rate makes sense (enum lookups should match most values)

- [ ] **Step 2: Check for unmatched values that should be matched**

Run: `grep "unmatched" output/pre-scripts/*.csv`

Review any unmatched values — they may need lookup corrections or indicate edge cases in the data.

- [ ] **Step 3: Verify existing mappings are covered**

Check that all known values for mapDiagnose, mapFoottype, and mapAnredeToGender show as matched. If unmatched values appear, these are gaps in the existing implementation.

- [ ] **Step 4: Final commit**

```bash
git add src/pre-scripts/
git commit -m "feat: complete extract-mappings pre-script with all mapping extractors"
```
