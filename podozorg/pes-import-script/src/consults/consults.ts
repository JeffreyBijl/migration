import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  readOrderFiles,
  parseAuftragForConsultation,
  readPatientsCsv,
  readScansCsv,
  readDiagnosesMap,
  writeConsultsCsv,
} from './helpers/consults.helpers.ts';
import { CONSULTS_OUTPUT_PATH, IAC_CONSULTS_CSV_PATH, PROGRESS_LOG_INTERVAL } from './consults.config.ts';
import type { PESConsultData } from './interfaces/pes-consultsdata.interface.ts';

const orderFiles = readOrderFiles();
console.log(`Found ${orderFiles.length} Auftrag.ini files`);

const patientLookup = readPatientsCsv();
console.log(`Loaded ${patientLookup.size} patients for lookup`);

const scanLookup = readScansCsv();
console.log(`Loaded ${scanLookup.size} scans for lookup`);

const diagnosesMap = readDiagnosesMap();
console.log(`Loaded ${diagnosesMap.size} diagnoses for mapping`);

const consults: PESConsultData[] = [];
let parseErrors = 0;

for (let i = 0; i < orderFiles.length; i++) {
  try {
    consults.push(parseAuftragForConsultation(orderFiles[i]));
  } catch (error) {
    parseErrors++;
    console.error(`Failed to parse ${orderFiles[i]}: ${error instanceof Error ? error.message : error}`);
  }

  if ((i + 1) % PROGRESS_LOG_INTERVAL === 0) {
    console.log(`Parsed ${i + 1}/${orderFiles.length} files...`);
  }
}

console.log(`Parsing complete: ${consults.length} parsed, ${parseErrors} errors`);

const result = writeConsultsCsv(consults, patientLookup, scanLookup, diagnosesMap);

const logLines: string[] = [
  `Total Auftrag.ini files found: ${orderFiles.length}`,
  `Files skipped (parse error): ${parseErrors}`,
  `consults created: ${result.created}`,
  `consults skipped (invalid): ${result.skippedInvalid}`,
  `consults skipped (patient not found): ${result.skippedNoPatient}`,
];

if (result.unmatchedDiagnoses.size > 0) {
  logLines.push('', 'Unmatched diagnoses:');
  for (const [diagnose, count] of result.unmatchedDiagnoses) {
    logLines.push(`  "${diagnose}": ${count} occurrence(s)`);
  }
}

if (existsSync(path.dirname(IAC_CONSULTS_CSV_PATH))) {
  copyFileSync(CONSULTS_OUTPUT_PATH, IAC_CONSULTS_CSV_PATH);
  console.log(`Copied CSV to ${IAC_CONSULTS_CSV_PATH}`);
}

logLines.forEach((line) => console.log(line));

const logDir = 'output/consults/logs';
mkdirSync(logDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
writeFileSync(`${logDir}/consults-import-${timestamp}.log`, logLines.join('\n') + '\n');
