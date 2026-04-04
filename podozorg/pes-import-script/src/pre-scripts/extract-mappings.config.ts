import path from 'node:path';

export const ORDERS_DATA_PATH = path.resolve('data/orders');

export const AUFTRAG_FILENAME_REGEX = /^\d{8}_\d{6}_.*_Auftrag\.ini$/;
export const THERAPIEPLAN_LINKS_REGEX = /^\d{8}_\d{6}_.*_Therapieplan_Links\.ini$/;
export const THERAPIEPLAN_RECHTS_REGEX = /^\d{8}_\d{6}_.*_Therapieplan_Rechts\.ini$/;

export const PRE_SCRIPTS_OUTPUT_PATH = path.resolve('output/pre-scripts');

// Lookup table paths (relative to pes-import-script/)
export const ELEMENTS_CSV_PATH = path.resolve('../../../../iac/scripts/elements/elements.csv');
export const GROUND_SOLE_PATTERNS_JSON_PATH = path.resolve('../../../../iac/scripts/ground-sole-patterns/i18n/nl-NL.json');
export const MATERIALS_JSON_PATH = path.resolve('../../../../iac/scripts/materials/i18n/nl-NL.json');
export const TOPCOVERS_JSON_PATH = path.resolve('../../../../iac/scripts/topcovers/i18n/nl-NL.json');
export const DIAGNOSES_JSON_PATH = path.resolve('../../../../iac/scripts/diagnoses/i18n/nl-NL.json');

export const MAPPING_OVERRIDES_PATH = path.resolve('data/mapping-overrides.json');

export const PROGRESS_LOG_INTERVAL = 500;
