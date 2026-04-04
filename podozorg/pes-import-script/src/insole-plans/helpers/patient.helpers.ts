import fs from 'node:fs';
import csv from 'csv-parser';
import { PATIENTS_CSV_PATH } from '../insole-plans.config.ts';

export function readPatientsCsv(): Promise<Map<string, string>> {
  return new Promise((resolve, reject) => {
    const lookup = new Map<string, string>();
    fs.createReadStream(PATIENTS_CSV_PATH)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const id = row.id?.trim();
        const tenantRef = row.tenant_ref?.trim();
        if (id && tenantRef) lookup.set(id, tenantRef);
      })
      .on('end', () => resolve(lookup))
      .on('error', reject);
  });
}
