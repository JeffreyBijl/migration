import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'node:path';
import { readTenantsData, writeTenantsCsv } from './helpers/tenants.helpers.ts';
import { IAC_TENANTS_CSV_PATH, TENANTS_OUTPUT_PATH } from './tenants.config.ts';

const tenants = readTenantsData();
const result = writeTenantsCsv(tenants);

const logLines: string[] = [
  `Tenants created: ${result.created}`,
  `Tenants skipped: ${result.skipped}`,
];

if (result.skippedTenants.length > 0) {
  logLines.push('Skipped tenants:');
  result.skippedTenants.forEach((tenant) => logLines.push(JSON.stringify(tenant)));
}

if (existsSync(path.dirname(IAC_TENANTS_CSV_PATH))) {
  copyFileSync(TENANTS_OUTPUT_PATH, IAC_TENANTS_CSV_PATH);
  console.log(`Copied CSV to ${IAC_TENANTS_CSV_PATH}`);
}

logLines.forEach((line) => console.log(line));

const logDir = 'output/tenants/logs';
mkdirSync(logDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
writeFileSync(`${logDir}/tenants-import-${timestamp}.log`, logLines.join('\n') + '\n');
