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
  MAPPING_OVERRIDES_PATH,
  PROGRESS_LOG_INTERVAL,
} from '../extract-mappings.config.ts';

// --- Types ---

export interface MappingResult {
  name: string;
  entries: Map<string, number>;
  matches: Map<string, { enum: string; matchType: 'exact' | 'normalized' | 'override' }>;
}

export type MappingOverrides = Record<string, Record<string, string>>;

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

// --- Overrides ---

/** Loads manual mapping overrides from data/mapping-overrides.json */
export function loadOverrides(): MappingOverrides {
  if (!fs.existsSync(MAPPING_OVERRIDES_PATH)) return {};

  const content = fs.readFileSync(MAPPING_OVERRIDES_PATH, 'utf-8');
  return JSON.parse(content);
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

/** Extract production method from Auftrag files: PRINTING if any Bemerkungen contains "3D PRINT", else MILLING */
export function extractProductionMethod(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    const werkstatt = parsed['Werkstatt'] ?? {};
    const bemerkungen = Object.entries(werkstatt)
      .filter(([key]) => key.toLowerCase().startsWith('bemerkungen'))
      .map(([, val]) => stripIniComment(val).toUpperCase());

    const method = bemerkungen.some((b) => b.includes('3D PRINT')) ? 'PRINTING' : 'MILLING';
    values.set(method, (values.get(method) ?? 0) + 1);
  }
  return values;
}

/** Extract all Bemerkungen fields from Auftrag files (for production_notes) */
export function extractProductionNotes(auftrags: Record<string, Record<string, string>>[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const parsed of auftrags) {
    const werkstatt = parsed['Werkstatt'] ?? {};
    const parts: string[] = [];
    for (const [key, val] of Object.entries(werkstatt)) {
      if (!key.toLowerCase().startsWith('bemerkungen')) continue;
      const cleaned = stripIniComment(val).trim();
      if (cleaned) parts.push(cleaned);
    }
    const combined = parts.join(' ');
    if (combined) {
      values.set(combined, (values.get(combined) ?? 0) + 1);
    }
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
  overrides?: Record<string, string>,
): MappingResult {
  const matches = new Map<string, { enum: string; matchType: 'exact' | 'normalized' | 'override' }>();

  for (const [sourceValue] of values) {
    const normalized = sourceValue.trim().toLowerCase();

    // Check overrides first
    if (overrides?.[normalized]) {
      matches.set(sourceValue, { enum: overrides[normalized], matchType: 'override' });
      continue;
    }

    const exactMatch = lookup.get(sourceValue);
    if (exactMatch) {
      matches.set(sourceValue, { enum: exactMatch, matchType: 'exact' });
      continue;
    }

    const normalizedMatch = lookup.get(normalized);
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
  overrides?: Record<string, string>,
): MappingResult {
  const matches = new Map<string, { enum: string; matchType: 'exact' | 'normalized' | 'override' }>();

  for (const [sourceValue] of values) {
    const normalized = sourceValue.trim().toLowerCase();

    if (overrides?.[normalized]) {
      matches.set(sourceValue, { enum: overrides[normalized], matchType: 'override' });
      continue;
    }

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
