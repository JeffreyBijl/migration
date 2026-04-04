import { mkdirSync, writeFileSync } from 'node:fs';
import { writeScansCsv } from './helpers/scans.helpers.ts';
import { SCANS_LOG_DIR } from './scans.config.ts';

const { totalFiles, groupsFormed, stats } = await writeScansCsv();

const logLines: string[] = [
  `Total scan files found: ${totalFiles}`,
  `Scan groups formed: ${groupsFormed}`,
  `Scans created: ${stats.created}`,
  `Skipped (unknown tenant): ${stats.skippedNoTenant}`,
  `Skipped (no Auftrag.ini): ${stats.skippedNoAuftrag}`,
];

if (stats.unknownTenantCounts.size > 0) {
  logLines.push('', 'Unknown tenants:');
  for (const [id, count] of stats.unknownTenantCounts) {
    logLines.push(`  ${id}: ${count} scans`);
  }
}

if (stats.unknownAuftragATs.length > 0) {
  logLines.push('', 'Missing Auftrag.ini for AT numbers:');
  for (const at of stats.unknownAuftragATs) {
    logLines.push(`  ${at}`);
  }
}

logLines.forEach((line) => console.log(line));

mkdirSync(SCANS_LOG_DIR, { recursive: true });
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
writeFileSync(`${SCANS_LOG_DIR}/scans-import-${timestamp}.log`, logLines.join('\n') + '\n');
