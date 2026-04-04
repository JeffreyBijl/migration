import { mkdirSync, writeFileSync } from 'node:fs';
import { readOrderFiles, filterOrderFilesByKnownTenants, parseAuftragFile, readTenantsCsv, writePatientsCsv } from './helpers/patients.helpers.ts';
import { PATIENTS_LOG_DIR, PROGRESS_LOG_INTERVAL } from './patients.config.ts';
import type { PESPatientData } from './interfaces/pes-patient-data.interface.ts';

const orderFiles = readOrderFiles();
console.log(`Found ${orderFiles.length} Auftrag.ini files`);

const tenantLookup = await readTenantsCsv();
console.log(`Loaded ${tenantLookup.size} tenants for lookup`);

const { knownFiles, skippedUnknownTenant, unknownTenantCounts } = filterOrderFilesByKnownTenants(orderFiles, tenantLookup);
console.log(`Pre-scan: ${knownFiles.length} files from known tenants, ${skippedUnknownTenant} skipped`);

const patients: PESPatientData[] = [];
let parseErrors = 0;

for (let i = 0; i < knownFiles.length; i++) {
  try {
    patients.push(parseAuftragFile(knownFiles[i]));
  } catch (error) {
    parseErrors++;
    console.error(`Failed to parse ${knownFiles[i]}: ${error instanceof Error ? error.message : error}`);
  }

  if ((i + 1) % PROGRESS_LOG_INTERVAL === 0) {
    console.log(`Parsed ${i + 1}/${knownFiles.length} files...`);
  }
}

console.log(`Parsing complete: ${patients.length} parsed, ${parseErrors} errors`);

const result = writePatientsCsv(patients, tenantLookup);

const logLines: string[] = [
  `Total Auftrag.ini files found: ${orderFiles.length}`,
  `Files skipped (unknown tenant): ${skippedUnknownTenant}`,
  `Files skipped (parse error): ${parseErrors}`,
  `Patients created: ${result.created}`,
  `Patients skipped (duplicates): ${result.skippedDuplicates}`,
  `Patients skipped (no tenant): ${result.skippedNoTenant}`,
  `Patients skipped (invalid): ${result.skippedInvalid}`,
];

if (unknownTenantCounts.size > 0) {
  logLines.push('', 'Unknown tenants:');
  for (const [id, count] of unknownTenantCounts) {
    logLines.push(`  ${id}: ${count} files`);
  }
}

logLines.forEach((line) => console.log(line));

mkdirSync(PATIENTS_LOG_DIR, { recursive: true });
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
writeFileSync(`${PATIENTS_LOG_DIR}/patients-import-${timestamp}.log`, logLines.join('\n') + '\n');
