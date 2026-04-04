import path from 'node:path';

export const SPLIT_SCANS_INPUT_PATH = path.resolve('../utils/split-scans/output');
export const DICOM_INPUT_PATH = path.resolve('../utils/convert-to-dicom/output');
export const ORDERS_DATA_PATH = path.resolve('data/orders');
export const TENANTS_CSV_PATH = path.resolve('output/tenants/tenants.csv');
export const SCANS_OUTPUT_PATH = path.resolve('output/scans/scans.csv');
export const SCANS_IAC_OUTPUT_PATH = path.resolve('../../../../iac/scripts/scans/scans.csv');
export const AUFTRAG_FILENAME_REGEX = /^\d{8}_\d{6}_.*_Auftrag\.ini$/;
export const SCAN_FILE_REGEX = /^\d{8}_\d{6}_.+\.FS2D\.(cadLeft|cadRight|dicomLeft|dicomRight|thumbLeft|thumbRight)\.(jpg|dcm)$/;
export const SCAN_BASE_REGEX = /^(.+?)\.FS2D\.(cadLeft|cadRight|dicomLeft|dicomRight|thumbLeft|thumbRight)\.(jpg|dcm)$/;
export const SCAN_CSV_HEADERS = [
  'id',
  'cad_template_url_left',
  'cad_template_url_right',
  'date',
  'device',
  'dicom_url_left',
  'dicom_url_right',
  'modality',
  'patient_id',
  'pixels_per_inch',
  'tenant_ref',
  'tenant_ref#date',
  'thumbnail_url_left',
  'thumbnail_url_right',
  'user_id',
];
export const SCAN_PIXELS_PER_INCH = '2.54';
export const SCAN_USER_ID = 'migration-user';
export const SCANS_LOG_DIR = path.resolve('output/scans/logs');
