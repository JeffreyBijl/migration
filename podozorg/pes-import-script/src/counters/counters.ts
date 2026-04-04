import { mkdirSync, writeFileSync } from 'node:fs';
import { readPatientsCsv, writeCountersCsv } from './helpers/counters.helpers.ts';

const tenantCounts = await readPatientsCsv();
console.log(`Found ${tenantCounts.size} tenants in patients.csv`);

const result = writeCountersCsv(tenantCounts);

const logLines: string[] = [
  `Tenants found: ${tenantCounts.size}`,
  `Counters created: ${result.created}`,
  '',
  'Tenant patient counts:',
];

for (const [tenantId, count] of tenantCounts) {
  logLines.push(`  ${tenantId}: ${count} patients`);
}

logLines.forEach((line) => console.log(line));

const logDir = 'output/counters/logs';
mkdirSync(logDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
writeFileSync(`${logDir}/counters-import-${timestamp}.log`, logLines.join('\n') + '\n');
