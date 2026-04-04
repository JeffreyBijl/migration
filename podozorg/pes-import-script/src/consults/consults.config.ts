import path from 'node:path';

export const ORDERS_DATA_PATH = path.resolve('data/orders');
export const PATIENTS_CSV_PATH = path.resolve('output/patients/patients.csv');
export const SCANS_CSV_PATH = path.resolve('output/scans/scans.csv');
export const CONSULTS_OUTPUT_PATH = path.resolve('output/consults/consults.csv');
export const IAC_CONSULTS_CSV_PATH = path.resolve('../../../../iac/scripts/consults/consults.csv');
export const DIAGNOSES_JSON_PATH = path.resolve('../../../../iac/scripts/diagnoses/i18n/nl-NL.json');

export const AUFTRAG_FILENAME_REGEX = /^\d{8}_\d{6}_.*_Auftrag\.ini$/;

export const PROGRESS_LOG_INTERVAL = 1000;

export const CONSULT_USER_ID = 'migration@insolution.nl';

export const CONSULT_CSV_HEADERS = [
  'id',
  'patient_id',
  'status',
  'date',
  'tenant_ref',
  'tenant_ref#date#id',
  'user_id',
  'profile_b_diagnosis',
  'profile_b_foot_type_left',
  'profile_b_foot_type_right',
  'scan_2d_templates',
  'active_assessment',
  'additional_tests',
  'complaints',
  'conclusion',
  'diagnosis',
  'dynamic_analyse_remark',
  'enable_reminder',
  'essential_info',
  'essential_info_notes',
  'evaluation_date',
  'evaluation_name',
  'evaluation_notes',
  'exercises',
  'follow_up_comments',
  'general_inspection',
  'hobbies',
  'insole_notes',
  'main_goal',
  'notes',
  'occupations',
  'passive_assessment',
  'pathologies',
  'profile_b_notes',
  'recovery',
  'referrals',
  'referring_practitioner',
  'remarks',
  'resistance_tests',
  'satisfaction',
  'scan_3d_templates',
  'scan_pp_templates',
  'shoe_advise',
  'shoes',
  'sports',
];
