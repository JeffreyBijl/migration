import path from 'node:path';
import { ETenantProfile } from '../shared/generated.ts';
import type { Tenant } from '../shared/generated.ts';

export type StaticParentTenant = Partial<Omit<Tenant, '__typename'>> & {
  id: string;
  tenant_ref: string;
  name: string;
  root_tenant_id: string;
};

export const TENANTS_DATA_PATH = path.resolve('data/tenants/tenants-data.json');

export const TENANTS_OUTPUT_PATH = path.resolve('output/tenants/tenants.csv');

export const IAC_TENANTS_CSV_PATH = path.resolve('../../../../iac/scripts/tenants/tenants.csv');

export const DEFAULT_WORKSHOP_CONFIG = {
  printingTenantId: 'ws-insolution-nijverdal',
  printingTenantRef: 'ws-root.ws-insolution.ws-insolution-nijverdal.',
  printingTenantName: 'Insolution Nijverdal',
  millingTenantId: 'ws-insolution-nijverdal',
  millingTenantRef: 'ws-root.ws-insolution.ws-insolution-nijverdal.',
  millingTenantName: 'Insolution Nijverdal',
};

export const TENANT_CSV_HEADERS = [
  'id',
  'parent_id',
  'tenant_ref',
  'name',
  'street',
  'house_number',
  'postal_code',
  'city',
  'country',
  'email',
  'phone',
  'profile',
  'root_tenant_id',
  'workshop_printing_tenant_id',
  'workshop_printing_tenant_ref',
  'workshop_printing_tenant_name',
  'workshop_milling_tenant_id',
  'workshop_milling_tenant_ref',
  'workshop_milling_tenant_name',
  'insole_element_libraries',
] satisfies (keyof Omit<Tenant, '__typename'> | 'root_tenant_id')[];

export const PARENT_REF_MAP: Record<string, string> = {
  podozorg: 'root.podozorg',
  'podozorg-expertise': 'root.podozorg.podozorg-expertise',
};

export const STATIC_PARENT_TENANTS: StaticParentTenant[] = [
  {
    id: 'root',
    tenant_ref: 'root.',
    name: 'Insolution Manager',
    profile: ETenantProfile.A,
    root_tenant_id: 'root',
  },
  {
    id: 'podozorg',
    parent_id: 'root',
    tenant_ref: 'root.podozorg.',
    name: 'Podozorg',
    profile: ETenantProfile.A,
    root_tenant_id: 'root',
  },
  {
    id: 'podozorg-expertise',
    parent_id: 'podozorg',
    tenant_ref: 'root.podozorg.podozorg-expertise.',
    name: 'Podozorg expertise',
    profile: ETenantProfile.A,
    root_tenant_id: 'root',
  },
  {
    id: 'ws-root',
    tenant_ref: 'ws-root.',
    name: 'Insolution',
    email: 'workshop@insolution.nl',
    root_tenant_id: 'ws-root',
  },
  {
    id: 'ws-insolution',
    parent_id: 'ws-root',
    tenant_ref: 'ws-root.ws-insolution.',
    name: 'Insolution Nijverdal',
    email: 'workshop@insolution.nl',
    root_tenant_id: 'ws-root',
  },
];
