import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  readOrderFiles,
  parseAuftragForInsolePlan,
  writeInsolePlansCsv,
} from './helpers/insole-plans.helpers.ts';
import { readPatientsCsv } from './helpers/patient.helpers.ts';
import { readTenantsCsv } from './helpers/tenant.helpers.ts';
import { IAC_INSOLE_PLANS_CSV_PATH, INSOLE_PLANS_LOG_DIR, INSOLE_PLANS_OUTPUT_PATH, PROGRESS_LOG_INTERVAL } from './insole-plans.config.ts';
import type { PESInsolePlanData, InsolePlanWriteResult } from './interfaces/insole-plans.interface.ts';

function writeImportLog(result: InsolePlanWriteResult, totalFiles: number, parseErrors: number): void {
  const logLines: string[] = [
    `Total Auftrag.ini files found: ${totalFiles}`,
    `Files skipped (parse error): ${parseErrors}`,
    `Insole plans created: ${result.created}`,
    `Insole plans skipped (unknown tenant): ${result.skipCounts.unknownTenant}`,
    `Insole plans skipped (patient not found): ${result.skipCounts.patientNotFound}`,
    `Insole plans skipped (missing Therapieplan): ${result.skipCounts.missingTherapieplan}`,
    `Insole plans skipped (duplicate AT): ${result.skipCounts.duplicate}`,
  ];

  if (result.unmappedElements.size > 0) {
    logLines.push('', 'Unmapped elements:');
    for (const [name, count] of result.unmappedElements) {
      logLines.push(`  "${name}": ${count} occurrence(s)`);
    }
  }

  logLines.forEach((line) => console.log(line));

  mkdirSync(INSOLE_PLANS_LOG_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  writeFileSync(`${INSOLE_PLANS_LOG_DIR}/insole-plans-import-${timestamp}.log`, logLines.join('\n') + '\n');
}

const orderFiles = readOrderFiles();
console.log(`Found ${orderFiles.length} Auftrag.ini files`);

const knownTenants = await readTenantsCsv();
console.log(`Loaded ${knownTenants.size} tenants for filtering`);

const patientLookup = await readPatientsCsv();
console.log(`Loaded ${patientLookup.size} patients for lookup`);

const orders: PESInsolePlanData[] = [];
let parseErrors = 0;

for (let i = 0; i < orderFiles.length; i++) {
  try {
    orders.push(parseAuftragForInsolePlan(orderFiles[i]));
  } catch (error) {
    parseErrors++;
    console.error(`Failed to parse ${orderFiles[i]}: ${error instanceof Error ? error.message : error}`);
  }

  if ((i + 1) % PROGRESS_LOG_INTERVAL === 0) {
    console.log(`Parsed ${i + 1}/${orderFiles.length} files...`);
  }
}

console.log(`Parsing complete: ${orders.length} parsed, ${parseErrors} errors`);

const result = writeInsolePlansCsv(orders, patientLookup, knownTenants);

const iacDir = path.dirname(IAC_INSOLE_PLANS_CSV_PATH);
if (existsSync(iacDir)) {
  copyFileSync(INSOLE_PLANS_OUTPUT_PATH, IAC_INSOLE_PLANS_CSV_PATH);
  console.log(`Copied CSV to ${IAC_INSOLE_PLANS_CSV_PATH}`);
} else {
  console.warn(`IAC directory not found, skipping copy: ${iacDir}`);
}

writeImportLog(result, orderFiles.length, parseErrors);
