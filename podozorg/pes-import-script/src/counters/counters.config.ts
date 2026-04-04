import path from 'node:path';
import type { Counter } from '../shared/generated.ts';

export const PATIENTS_CSV_PATH = path.resolve('output/patients/patients.csv');

export const COUNTERS_OUTPUT_PATH = path.resolve('output/counters/counters.csv');

export const COUNTER_CSV_HEADERS = [
  'manager_tenant_id',
  'counter_type',
  'counter',
] satisfies (keyof Omit<Counter, '__typename'>)[];
