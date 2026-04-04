import fs from 'node:fs';
import path from 'node:path';
import type { PESTenantData } from '../interfaces/pes-tenant-data.interface.ts';
import { ETenantProfile } from '../../shared/generated.ts';
import { DEFAULT_WORKSHOP_CONFIG, PARENT_REF_MAP, STATIC_PARENT_TENANTS, TENANT_CSV_HEADERS, TENANTS_DATA_PATH, TENANTS_OUTPUT_PATH } from '../tenants.config.ts';

export function readTenantsData(): PESTenantData[] {
  try {
    const tenantsData = fs.readFileSync(TENANTS_DATA_PATH, 'utf-8');
    return JSON.parse(tenantsData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error('tenants-data.json not found');
    }
    throw error;
  }
}

export function writeTenantsCsv(tenants: PESTenantData[]): {
  created: number;
  skipped: number;
  skippedTenants: unknown[];
} {
  const validTenants: PESTenantData[] = [];
  const invalidTenants: unknown[] = [];

  for (const tenant of tenants) {
    if (validatePesTenantData(tenant)) {
      validTenants.push(tenant);
    } else {
      invalidTenants.push(tenant);
    }
  }

  const { duplicateTenants: duplicateByIds } = checkDuplicateTenantIds(validTenants);
  const { duplicateTenants: duplicateByNames } = checkDuplicateTenantNames(validTenants);
  const allDuplicates = [...duplicateByIds, ...duplicateByNames];
  const uniqueTenants: PESTenantData[] = [];
  const duplicateTenants: PESTenantData[] = [];

  for (const tenant of validTenants) {
    if (allDuplicates.includes(tenant)) {
      duplicateTenants.push(tenant);
    } else {
      uniqueTenants.push(tenant);
    }
  }

  const csvData = createTenantCsvData(uniqueTenants);
  const dir = path.dirname(TENANTS_OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TENANTS_OUTPUT_PATH, csvData, 'utf-8');

  return {
    created: uniqueTenants.length,
    skipped: invalidTenants.length + duplicateTenants.length,
    skippedTenants: [...invalidTenants, ...duplicateTenants],
  };
}

export function createTenantCsvData(tenants: PESTenantData[]): string {
  const headerRow = TENANT_CSV_HEADERS.join(';');

  const dataRows = tenants.map((tenant) => {
    return TENANT_CSV_HEADERS.map((header) => {
      if (header === 'id') return tenant.tenantObseleteID;
      if (header === 'parent_id') return tenant.parentTenantObseleteID ?? '';
      if (header === 'tenant_ref') {
        const parentRef = PARENT_REF_MAP[tenant.parentTenantObseleteID ?? ''] ?? `root.${tenant.parentTenantObseleteID ?? ''}`;
        return `${parentRef}.${tenant.tenantObseleteID}.`;
      }
      if (header === 'name') return tenant.tenantName;
      if (header === 'street') return tenant.tenantStreetName ?? '';
      if (header === 'house_number') return tenant.tenantHouseNo != null ? String(tenant.tenantHouseNo) : '';
      if (header === 'postal_code') return tenant.tenantPostalCode ?? '';
      if (header === 'city') return tenant.tenantCity ?? '';
      if (header === 'country') return tenant.tenantCountry ?? '';
      if (header === 'email') return tenant.tenantEmail ?? '';
      if (header === 'phone') return tenant.tenantPhone != null ? String(tenant.tenantPhone) : '';
      if (header === 'profile') return ETenantProfile.B;
      if (header === 'root_tenant_id') return 'root';
      if (header === 'workshop_printing_tenant_id') return tenant.workshopPrintingTenantId ?? DEFAULT_WORKSHOP_CONFIG.printingTenantId;
      if (header === 'workshop_printing_tenant_ref') return tenant.workshopPrintingTenantRef ?? DEFAULT_WORKSHOP_CONFIG.printingTenantRef;
      if (header === 'workshop_printing_tenant_name') return tenant.workshopPrintingTenantName ?? DEFAULT_WORKSHOP_CONFIG.printingTenantName;
      if (header === 'workshop_milling_tenant_id') return tenant.workshopMillingTenantId ?? DEFAULT_WORKSHOP_CONFIG.millingTenantId;
      if (header === 'workshop_milling_tenant_ref') return tenant.workshopMillingTenantRef ?? DEFAULT_WORKSHOP_CONFIG.millingTenantRef;
      if (header === 'workshop_milling_tenant_name') return tenant.workshopMillingTenantName ?? DEFAULT_WORKSHOP_CONFIG.millingTenantName;
      if (header === 'insole_element_libraries') return 'TREATMENT_ELEMENTS';
      return '';
    }).join(';');
  });

  const staticRows = STATIC_PARENT_TENANTS.map((tenant) => {
    return TENANT_CSV_HEADERS.map((header) => tenant[header as keyof typeof tenant] ?? '').join(';');
  });

  return [headerRow, ...staticRows, ...dataRows].join('\n');
}

export function checkDuplicateTenants(
  tenants: PESTenantData[],
  keyFn: (tenant: PESTenantData) => string | number,
): {
  uniqueTenants: PESTenantData[];
  duplicateTenants: PESTenantData[];
} {
  const keyCount = new Map<string | number, number>();

  for (const tenant of tenants) {
    const key = keyFn(tenant);
    keyCount.set(key, (keyCount.get(key) ?? 0) + 1);
  }

  const duplicateKeys = new Set<string | number>();
  for (const [key, count] of keyCount) {
    if (count > 1) duplicateKeys.add(key);
  }

  const uniqueTenants: PESTenantData[] = [];
  const duplicateTenants: PESTenantData[] = [];

  for (const tenant of tenants) {
    if (duplicateKeys.has(keyFn(tenant))) {
      duplicateTenants.push(tenant);
    } else {
      uniqueTenants.push(tenant);
    }
  }

  return { uniqueTenants, duplicateTenants };
}

export function checkDuplicateTenantIds(tenants: PESTenantData[]) {
  return checkDuplicateTenants(tenants, (tenant) => tenant.tenantObseleteID);
}

export function checkDuplicateTenantNames(tenants: PESTenantData[]) {
  return checkDuplicateTenants(tenants, (tenant) => tenant.tenantName);
}

export function validatePesTenantData(value: unknown): value is PESTenantData {
  if (typeof value !== 'object' || value === null) return false;
  const data = value as PESTenantData;
  return typeof data.tenantObseleteID === 'number'
    && typeof data.tenantName === 'string';
}
