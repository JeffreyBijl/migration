import path from 'node:path';
import type { Patient } from '../shared/generated.ts';

export const ORDERS_DATA_PATH = path.resolve('data/orders');

export const TENANTS_CSV_PATH = path.resolve('output/tenants/tenants.csv');

export const PATIENTS_OUTPUT_PATH = path.resolve('output/patients/patients.csv');

export const PATIENTS_IAC_OUTPUT_PATH = path.resolve('../../../../iac/scripts/patients/patients.csv');
export const PATIENTS_LOG_DIR = path.resolve('output/patients/logs');

export const AUFTRAG_FILENAME_REGEX = /^\d{8}_\d{6}_.*_Auftrag\.ini$/;

export const KUNDENNUMMER_FILENAME_REGEX = /^\d{8}_\d{6}_(\d+)-/;

export const PROGRESS_LOG_INTERVAL = 1000;

export const PATIENT_CSV_HEADERS = [
  'id',
  'patient_number',
  'tenant_ref',
  'tenant_id',
  'external_id',
  'first_name',
  'middle_name',
  'last_name',
  'salutation',
  'title',
  'initials',
  'street',
  'house_number',
  'postal_code',
  'province',
  'city',
  'country',
  'phone',
  'mobile',
  'email',
  'date_of_birth',
  'status',
  'gender',
  'notes',
  'bsn_number',
  'id_type',
  'id_number',
  'health_insurer',
  'health_insurance_number',
  'referrer',
  'search_terms',
] satisfies (keyof Omit<Patient, '__typename' | 'anonymized_at' | 'anonymized_by'>)[];
