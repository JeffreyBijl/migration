import fs from 'node:fs';
import path from 'node:path';
import csv from 'csv-parser';
import { ECounterType } from '../../shared/generated.ts';
import { COUNTER_CSV_HEADERS, COUNTERS_OUTPUT_PATH, PATIENTS_CSV_PATH } from '../counters.config.ts';

export function readPatientsCsv(): Promise<Map<string, number>> {
  return new Promise((resolve, reject) => {
    const tenantCounts = new Map<string, number>();
    fs.createReadStream(PATIENTS_CSV_PATH)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const tenantId = row.tenant_id?.trim();
        if (tenantId) {
          tenantCounts.set(tenantId, (tenantCounts.get(tenantId) ?? 0) + 1);
        }
      })
      .on('end', () => resolve(tenantCounts))
      .on('error', reject);
  });
}

export function createCounterCsvData(tenantCounts: Map<string, number>): string {
  const headerRow = COUNTER_CSV_HEADERS.join(';');
  const dataRows: string[] = [];

  for (const [tenantId, count] of tenantCounts) {
    dataRows.push([tenantId, ECounterType.Patient, String(count)].join(';'));
  }

  return [headerRow, ...dataRows].join('\n');
}

export function writeCountersCsv(tenantCounts: Map<string, number>): { created: number } {
  const csvData = createCounterCsvData(tenantCounts);

  const dir = path.dirname(COUNTERS_OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(COUNTERS_OUTPUT_PATH, csvData, 'utf-8');

  return { created: tenantCounts.size };
}
