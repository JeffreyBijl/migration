import path from 'node:path';
import { EBottomFinish } from '../shared/generated.ts';

export const ORDERS_DATA_PATH = path.resolve('data/orders');
export const PATIENTS_CSV_PATH = path.resolve('output/patients/patients.csv');
export const TENANTS_CSV_PATH = path.resolve('output/tenants/tenants.csv');
export const INSOLE_PLANS_OUTPUT_PATH = path.resolve('output/insole-plans/insole-plans.csv');
export const IAC_INSOLE_PLANS_CSV_PATH = path.resolve('../../../../iac/scripts/insole-plans/insole-plans.csv');
export const INSOLE_PLANS_LOG_DIR = path.resolve('output/insole-plans/logs');

export const AUFTRAG_FILENAME_REGEX = /^\d{8}_\d{6}_.*_Auftrag\.ini$/;
export const PROGRESS_LOG_INTERVAL = 1000;

export const INSOLE_PLAN_USER_ID = 'migration-user';
export const INSOLE_PLAN_NAME = 'Zolenplan';

export const WORKSHOP_CONFIG = {
  millingTenantRef: 'ws-root.ws-insolution.ws-insolution-nijverdal.',
  millingTenantName: 'Insolution Nijverdal',
  printingTenantRef: 'ws-root.ws-insolution.ws-insolution-nijverdal.',
  printingTenantName: 'Insolution Nijverdal',
};

export const BOTTOM_FINISH_ALIASES: Record<string, EBottomFinish> = {
  DUREA_BREED: EBottomFinish.DureaWide,
};

export const INSOLE_PLAN_CSV_HEADERS = [
  'id',
  'consult_id',
  'created_at',
  'manager_tenant_ref',
  'name',
  'patient_id',
  'user_id',
  'workshop_tenant_ref',
  'elements',
  'insole_type',
  'modelling_required',
  'ground_sole_pattern',
  'production_method',
  'side',
  'size',
  'size_system',
  'cad_model',
  'production_notes',
  'core_material',
  'finishing_by',
  'infill',
  'workshop',
  'bottom_finish',
  'top_cover_material',
  'ground_sole_thickness_left',
  'ground_sole_thickness_right',
  'heel_lift_left',
  'heel_lift_right',
  'hind_foot_left',
  'hind_foot_right',
  'middle_hind_foot_left',
  'middle_hind_foot_right',
  'sole_lateral_rotation_left',
  'sole_lateral_rotation_right',
  'sole_medial_rotation_left',
  'sole_medial_rotation_right',
  'rear_foot_lateral_rotation_left',
  'rear_foot_lateral_rotation_right',
  'rear_foot_medial_rotation_left',
  'rear_foot_medial_rotation_right',
  'fore_foot_lateral_rotation_left',
  'fore_foot_lateral_rotation_right',
  'fore_foot_medial_rotation_left',
  'fore_foot_medial_rotation_right',
] as const;
