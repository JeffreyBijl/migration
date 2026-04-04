import fs from 'node:fs';
import csv from 'csv-parser';
import { TENANTS_CSV_PATH } from '../insole-plans.config.ts';

export function readTenantsCsv(): Promise<Set<string>> {
  return new Promise((resolve, reject) => {
    const knownTenants = new Set<string>();
    fs.createReadStream(TENANTS_CSV_PATH)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const id = row.id?.trim();
        if (id) knownTenants.add(id);
      })
      .on('end', () => resolve(knownTenants))
      .on('error', reject);
  });
}
