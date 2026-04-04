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
  extractProductionNotes,
  extractCoreMaterial,
  extractTopCoverMaterial,
  extractDiagnose,
  extractFoottype,
  extractAnredeToGender,
  matchAgainstLookup,
  matchWithHardcoded,
  writeMappingCsv,
  writeMappingTs,
  buildSummaryLine,
  loadOverrides,
} from './helpers/extract-mappings.helpers.ts';
import type { MappingResult } from './helpers/extract-mappings.helpers.ts';
import { PRE_SCRIPTS_OUTPUT_PATH } from './extract-mappings.config.ts';

// --- Load overrides ---
const overrides = loadOverrides();
const overrideCount = Object.values(overrides).reduce((sum, map) => sum + Object.keys(map).length, 0);
console.log(`Loaded ${overrideCount} manual overrides from mapping-overrides.json`);

// --- Load lookups ---
console.log('\nLoading lookup tables...');
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
  milling: 'MILLING',
  printing: 'PRINTING',
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
  { name: 'productionNotes', functionName: 'productionNotes', values: extractProductionNotes(auftrags) },
  { name: 'mapCoreMaterial', functionName: 'mapCoreMaterial', values: extractCoreMaterial(auftrags), lookup: materialsLookup },
  { name: 'mapInfill', functionName: 'mapInfill', values: extractCoreMaterial(auftrags) },
  { name: 'mapTopCoverMaterial', functionName: 'mapTopCoverMaterial', values: extractTopCoverMaterial(auftrags), lookup: topcoversLookup },
  { name: 'mapDiagnose', functionName: 'mapDiagnose', values: extractDiagnose(auftrags), lookup: diagnosesLookup },
  { name: 'mapFoottype', functionName: 'mapFoottype', values: extractFoottype(auftrags), hardcoded: HARDCODED_FOOTTYPE },
  { name: 'mapAnredeToGender', functionName: 'mapAnredeToGender', values: extractAnredeToGender(auftrags), hardcoded: HARDCODED_GENDER, fallback: "'UNKNOWN'" },
];

// --- Extract, match, and write ---
console.log('\nExtracting and matching values...\n');

const logLines: string[] = [];

for (const mapping of mappings) {
  const mappingOverrides = overrides[mapping.name];
  let result: MappingResult;
  if (mapping.lookup) {
    result = matchAgainstLookup(mapping.name, mapping.values, mapping.lookup, mappingOverrides);
  } else if (mapping.hardcoded) {
    result = matchWithHardcoded(mapping.name, mapping.values, mapping.hardcoded, mappingOverrides);
  } else {
    result = matchWithHardcoded(mapping.name, mapping.values, {}, mappingOverrides);
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
