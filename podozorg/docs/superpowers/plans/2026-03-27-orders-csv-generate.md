# Orders CSV Generate Script — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate an `orders.csv` from Podozorg Auftrag.ini files following the existing migration module pattern.

**Architecture:** Self-contained `src/orders/` module with config, interfaces, helpers, and main script. Reads Auftrag.ini files and cross-references patients.csv, tenants.csv, insole-plans.csv, and scans.csv to produce the output CSV. Follows the `filter → map → write` pipeline pattern established by insole-plans and consults.

**Tech Stack:** TypeScript (tsx), csv-parser, ini

**Spec:** `docs/superpowers/specs/2026-03-27-orders-csv-generate-design.md`

**Reference modules:** `src/insole-plans/` (closest match), `src/consults/`

---

### Task 1: Create interfaces

**Files:**
- Create: `pes-import-script/src/orders/interfaces/orders.interface.ts`

- [ ] **Step 1: Create the interfaces file**

```typescript
export interface PESOrderData {
  at: string;
  pNummer: string;
  kundennummer: string;
  erstellt: string;
  versandadresseName?: string;
  versandart?: string;
  bemerkungen: string[];
}

export interface TenantRecord {
  id: string;
  name: string;
  tenantRef: string;
}

export interface InsolePlanEntry {
  id: string;
  productionMethod: string;
}

export type SkipReason = 'duplicate' | 'unknownTenant' | 'patientNotFound' | 'noInsolePlan';

export type OrderValidationResult =
  | { valid: true; patientId: string; tenant: TenantRecord; insolePlanId: string; productionMethod: string }
  | { valid: false; reason: SkipReason };

export interface ValidatedOrder {
  order: PESOrderData;
  patientId: string;
  tenant: TenantRecord;
  insolePlanId: string;
  productionMethod: string;
}

export interface FilterResult {
  validOrders: ValidatedOrder[];
  skipCounts: Record<SkipReason, number>;
}

export interface OrderWriteResult {
  created: number;
  skipCounts: Record<SkipReason, number>;
}
```

- [ ] **Step 2: Commit**

```bash
git add pes-import-script/src/orders/interfaces/orders.interface.ts
git commit -m "add orders interfaces"
```

---

### Task 2: Create config

**Files:**
- Create: `pes-import-script/src/orders/orders.config.ts`
- Reference: `pes-import-script/src/insole-plans/insole-plans.config.ts`

- [ ] **Step 1: Create the config file**

```typescript
import path from 'node:path';
import { EShippingTarget } from '../shared/generated.ts';

export const ORDERS_DATA_PATH = path.resolve('data/orders');
export const PATIENTS_CSV_PATH = path.resolve('output/patients/patients.csv');
export const TENANTS_CSV_PATH = path.resolve('output/tenants/tenants.csv');
export const INSOLE_PLANS_CSV_PATH = path.resolve('output/insole-plans/insole-plans.csv');
export const SCANS_CSV_PATH = path.resolve('output/scans/scans.csv');
export const ORDERS_OUTPUT_PATH = path.resolve('output/orders/orders.csv');
export const IAC_ORDERS_CSV_PATH = path.resolve('../../../../iac/scripts/orders/orders.csv');
export const ORDERS_LOG_DIR = path.resolve('output/orders/logs');

export const AUFTRAG_FILENAME_REGEX = /^\d{8}_\d{6}_.*_Auftrag\.ini$/;
export const PROGRESS_LOG_INTERVAL = 1000;
export const ORDER_USER_ID = 'migration-user';
export const MIGRATION_BATCH = 1;

// TODO: meaning of the 'material' field on orders is unclear — leave empty until resolved
export const ORDER_MATERIAL = '';

export const WORKSHOP_CONFIG = {
  millingTenantId: 'ws-insolution-nijverdal',
  millingTenantRef: 'ws-root.ws-insolution.ws-insolution-nijverdal.',
  printingTenantId: 'ws-insolution-nijverdal',
  printingTenantRef: 'ws-root.ws-insolution.ws-insolution-nijverdal.',
};

export const SHIPPING_TARGET_MAP: Record<string, EShippingTarget> = {
  // Fill in with known Versandadresse.NAME values as they are discovered
};
export const SHIPPING_TARGET_DEFAULT = EShippingTarget.Tenant;

export const ORDER_CSV_HEADERS = [
  'id',
  'order_number',
  'external_order_number',
  'manager_user_id',
  'status',
  'material',
  'production_method',
  'created_at',
  'confirmed_at',
  'attachments',
  'manager_tenant_id',
  'manager_tenant_name',
  'manager_tenant_ref',
  'workshop_tenant_id',
  'workshop_tenant_ref',
  'version_number',
  'consult_id',
  'insole_plan_id',
  'shipping_target',
  'is_urgent',
  'rework_reason',
  'scan_2d_templates',
  'scan_3d_templates',
  'scan_pp_templates',
  'search_terms',
];
```

- [ ] **Step 2: Commit**

```bash
git add pes-import-script/src/orders/orders.config.ts
git commit -m "add orders config"
```

---

### Task 3: Create helpers — CSV readers

**Files:**
- Create: `pes-import-script/src/orders/helpers/orders.helpers.ts`
- Reference: `pes-import-script/src/insole-plans/helpers/patient.helpers.ts`, `pes-import-script/src/insole-plans/helpers/tenant.helpers.ts`, `pes-import-script/src/consults/helpers/consults.helpers.ts` (for readScansCsv)

This task creates the file with just the CSV reader functions and INI parsing. Pipeline functions are added in Task 4.

- [ ] **Step 1: Create helpers file with readers and parsing**

```typescript
import fs from 'node:fs';
import path from 'node:path';
import ini from 'ini';
import csv from 'csv-parser';
import { EOrderStatus, EProductionMethod } from '../../shared/generated.ts';
import type {
  PESOrderData,
  TenantRecord,
  InsolePlanEntry,
  ValidatedOrder,
  FilterResult,
  OrderValidationResult,
  OrderWriteResult,
  SkipReason,
} from '../interfaces/orders.interface.ts';
import {
  AUFTRAG_FILENAME_REGEX,
  ORDERS_DATA_PATH,
  PATIENTS_CSV_PATH,
  TENANTS_CSV_PATH,
  INSOLE_PLANS_CSV_PATH,
  SCANS_CSV_PATH,
  ORDER_CSV_HEADERS,
  ORDER_USER_ID,
  ORDER_MATERIAL,
  MIGRATION_BATCH,
  ORDERS_OUTPUT_PATH,
  WORKSHOP_CONFIG,
  SHIPPING_TARGET_MAP,
  SHIPPING_TARGET_DEFAULT,
} from '../orders.config.ts';

export function readOrderFiles(): string[] {
  const files = fs.readdirSync(ORDERS_DATA_PATH, 'utf-8');
  return files.filter((file) => AUFTRAG_FILENAME_REGEX.test(file)).sort((a, b) => b.localeCompare(a));
}

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

export function readTenantsCsv(): Promise<Map<string, TenantRecord>> {
  return new Promise((resolve, reject) => {
    const lookup = new Map<string, TenantRecord>();
    fs.createReadStream(TENANTS_CSV_PATH)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const id = row.id?.trim();
        const name = row.name?.trim();
        const tenantRef = row.tenant_ref?.trim();
        if (id && name && tenantRef) {
          lookup.set(tenantRef, { id, name, tenantRef });
        }
      })
      .on('end', () => resolve(lookup))
      .on('error', reject);
  });
}

export function readInsolePlansCsv(): Promise<Map<string, InsolePlanEntry>> {
  return new Promise((resolve, reject) => {
    const lookup = new Map<string, InsolePlanEntry>();
    fs.createReadStream(INSOLE_PLANS_CSV_PATH)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const id = row.id?.trim();
        const productionMethod = row.production_method?.trim();
        if (!id) return;
        const at = id.replace(/^insoleplan-/, '');
        lookup.set(at, { id, productionMethod });
      })
      .on('end', () => resolve(lookup))
      .on('error', reject);
  });
}

export function readScansCsv(): Promise<Map<string, string>> {
  return new Promise((resolve, reject) => {
    const lookup = new Map<string, string>();
    fs.createReadStream(SCANS_CSV_PATH)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const scanId = row.id?.trim();
        if (!scanId) return;
        const at = scanId.replace(/^2d-scan-/, '');
        lookup.set(at, scanId);
      })
      .on('end', () => resolve(lookup))
      .on('error', reject);
  });
}

export function parseAuftragForOrder(fileName: string): PESOrderData {
  const filePath = path.join(ORDERS_DATA_PATH, fileName);
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString('utf16le').replace(/^\uFEFF/, '');
  const parsed = ini.parse(content);

  const auftrag = parsed['Auftrag'] ?? {};
  const kunde = parsed['Kunde'] ?? {};
  const werkstatt = parsed['Werkstatt'] ?? {};
  const versandadresse = parsed['Versandadresse'] ?? {};

  const bemerkungen: string[] = [];
  for (const key of Object.keys(werkstatt)) {
    if (key.toLowerCase().startsWith('bemerkungen')) {
      const val = String(werkstatt[key] ?? '').trim();
      if (val) bemerkungen.push(val);
    }
  }

  return {
    at: String(auftrag['AT'] ?? '').trim(),
    pNummer: String(kunde['P_Nummer'] ?? '').trim(),
    kundennummer: String(auftrag['Kundennummer'] ?? '').trim(),
    erstellt: String(auftrag['Erstellt'] ?? '').trim(),
    versandadresseName: String(versandadresse['NAME'] ?? '').trim() || undefined,
    versandart: String(werkstatt['Versandart'] ?? '').trim() || undefined,
    bemerkungen,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add pes-import-script/src/orders/helpers/orders.helpers.ts
git commit -m "add orders helpers — CSV readers and INI parsing"
```

---

### Task 4: Add helpers — mapping and pipeline functions

**Files:**
- Modify: `pes-import-script/src/orders/helpers/orders.helpers.ts`

- [ ] **Step 1: Add mapping helpers after `parseAuftragForOrder`**

Append the following functions to `orders.helpers.ts`:

```typescript
export function determineProductionMethod(bemerkungen: string[]): string {
  const has3dPrint = bemerkungen.some((b) => b.toLowerCase().includes('3d print'));
  return has3dPrint ? EProductionMethod.Printing : EProductionMethod.Milling;
}

export function mapShippingTarget(versandadresseName: string | undefined): string {
  if (!versandadresseName) return SHIPPING_TARGET_DEFAULT;
  return SHIPPING_TARGET_MAP[versandadresseName] ?? SHIPPING_TARGET_DEFAULT;
}

export function formatCreatedDate(value: string): string {
  const [datePart, timePart = '00:00:00'] = value.trim().split(/\s+/);
  const [day, month, year] = datePart.split('.');
  return new Date(`${year}-${month}-${day}T${timePart}Z`).toISOString();
}
```

- [ ] **Step 2: Add validation and filter functions**

Append:

```typescript
export function validateOrder(
  order: PESOrderData,
  patientLookup: Map<string, string>,
  tenantLookup: Map<string, TenantRecord>,
  insolePlanLookup: Map<string, InsolePlanEntry>,
  seenATs: Set<string>,
): OrderValidationResult {
  if (seenATs.has(order.at)) return { valid: false, reason: 'duplicate' };

  const patientId = 'podozorg-' + order.pNummer;
  const tenantRef = patientLookup.get(patientId);
  if (!tenantRef) return { valid: false, reason: 'patientNotFound' };

  const tenant = tenantLookup.get(tenantRef);
  if (!tenant) return { valid: false, reason: 'unknownTenant' };

  const insolePlan = insolePlanLookup.get(order.at);
  if (!insolePlan) return { valid: false, reason: 'noInsolePlan' };

  return { valid: true, patientId, tenant, insolePlanId: insolePlan.id, productionMethod: insolePlan.productionMethod };
}

export function filterValidOrders(
  orders: PESOrderData[],
  patientLookup: Map<string, string>,
  tenantLookup: Map<string, TenantRecord>,
  insolePlanLookup: Map<string, InsolePlanEntry>,
): FilterResult {
  const skipCounts: Record<SkipReason, number> = { duplicate: 0, unknownTenant: 0, patientNotFound: 0, noInsolePlan: 0 };
  const seenATs = new Set<string>();
  const validOrders: ValidatedOrder[] = [];

  for (const order of orders) {
    const validation = validateOrder(order, patientLookup, tenantLookup, insolePlanLookup, seenATs);

    if (!validation.valid) {
      console.warn(`Skipping order ${order.at}: ${validation.reason}`);
      skipCounts[validation.reason]++;
      continue;
    }

    seenATs.add(order.at);
    validOrders.push({
      order,
      patientId: validation.patientId,
      tenant: validation.tenant,
      insolePlanId: validation.insolePlanId,
      productionMethod: validation.productionMethod,
    });
  }

  return { validOrders, skipCounts };
}
```

- [ ] **Step 3: Add mapOrdersToCsvRows and writeOrdersCsv**

Append:

```typescript
export function mapOrdersToCsvRows(
  validOrders: ValidatedOrder[],
  scanLookup: Map<string, string>,
): string[] {
  const dataRows: string[] = [];
  const orderNumberCounters = new Map<string, number>();

  for (const { order, patientId, tenant, insolePlanId, productionMethod } of validOrders) {
    const counter = (orderNumberCounters.get(order.kundennummer) ?? 0) + 1;
    orderNumberCounters.set(order.kundennummer, counter);

    const orderNumber = `${order.kundennummer}-mig-${MIGRATION_BATCH}-${counter}`;
    const createdAt = formatCreatedDate(order.erstellt);
    const scanId = scanLookup.get(order.at);
    const scanTemplates = scanId ? `[${scanId}]` : '[]';

    const workshopTenantId = productionMethod === EProductionMethod.Milling
      ? WORKSHOP_CONFIG.millingTenantId
      : WORKSHOP_CONFIG.printingTenantId;

    const workshopTenantRef = productionMethod === EProductionMethod.Milling
      ? WORKSHOP_CONFIG.millingTenantRef
      : WORKSHOP_CONFIG.printingTenantRef;

    const values: Record<string, string> = {
      id: `order-${order.at}`,
      order_number: orderNumber,
      external_order_number: order.at,
      manager_user_id: ORDER_USER_ID,
      status: EOrderStatus.Shipped,
      material: ORDER_MATERIAL,
      production_method: productionMethod,
      created_at: createdAt,
      confirmed_at: createdAt,
      attachments: '[]',
      manager_tenant_id: tenant.id,
      manager_tenant_name: tenant.name,
      manager_tenant_ref: tenant.tenantRef,
      workshop_tenant_id: workshopTenantId,
      workshop_tenant_ref: workshopTenantRef,
      version_number: '1',
      consult_id: `consult-${order.at}`,
      insole_plan_id: insolePlanId,
      shipping_target: mapShippingTarget(order.versandadresseName),
      is_urgent: String(!!order.versandart && order.versandart !== 'normal'),
      rework_reason: '',
      scan_2d_templates: scanTemplates,
      scan_3d_templates: '[]',
      scan_pp_templates: '[]',
      search_terms: `${orderNumber}, ${ORDER_USER_ID}`,
    };

    dataRows.push(ORDER_CSV_HEADERS.map((h) => values[h] ?? '').join(';'));
  }

  return dataRows;
}

export function writeOrdersCsv(
  orders: PESOrderData[],
  patientLookup: Map<string, string>,
  tenantLookup: Map<string, TenantRecord>,
  insolePlanLookup: Map<string, InsolePlanEntry>,
  scanLookup: Map<string, string>,
): OrderWriteResult {
  const { validOrders, skipCounts } = filterValidOrders(orders, patientLookup, tenantLookup, insolePlanLookup);
  const dataRows = mapOrdersToCsvRows(validOrders, scanLookup);

  const csvData = [ORDER_CSV_HEADERS.join(';'), ...dataRows].join('\n');
  fs.mkdirSync(path.dirname(ORDERS_OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(ORDERS_OUTPUT_PATH, csvData, 'utf-8');

  return { created: dataRows.length, skipCounts };
}
```

- [ ] **Step 4: Commit**

```bash
git add pes-import-script/src/orders/helpers/orders.helpers.ts
git commit -m "add orders helpers — mapping and pipeline functions"
```

---

### Task 5: Create main script

**Files:**
- Create: `pes-import-script/src/orders/orders.ts`
- Reference: `pes-import-script/src/insole-plans/insole-plans.ts`

- [ ] **Step 1: Create the main script**

```typescript
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  readOrderFiles,
  parseAuftragForOrder,
  readPatientsCsv,
  readTenantsCsv,
  readInsolePlansCsv,
  readScansCsv,
  writeOrdersCsv,
} from './helpers/orders.helpers.ts';
import { IAC_ORDERS_CSV_PATH, ORDERS_LOG_DIR, ORDERS_OUTPUT_PATH, PROGRESS_LOG_INTERVAL } from './orders.config.ts';
import type { PESOrderData, OrderWriteResult } from './interfaces/orders.interface.ts';

function writeImportLog(result: OrderWriteResult, totalFiles: number, parseErrors: number): void {
  const logLines: string[] = [
    `Total Auftrag.ini files found: ${totalFiles}`,
    `Files skipped (parse error): ${parseErrors}`,
    `Orders created: ${result.created}`,
    `Orders skipped (duplicate AT): ${result.skipCounts.duplicate}`,
    `Orders skipped (patient not found): ${result.skipCounts.patientNotFound}`,
    `Orders skipped (unknown tenant): ${result.skipCounts.unknownTenant}`,
    `Orders skipped (no insole plan): ${result.skipCounts.noInsolePlan}`,
  ];

  logLines.forEach((line) => console.log(line));

  mkdirSync(ORDERS_LOG_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  writeFileSync(`${ORDERS_LOG_DIR}/orders-import-${timestamp}.log`, logLines.join('\n') + '\n');
}

const orderFiles = readOrderFiles();
console.log(`Found ${orderFiles.length} Auftrag.ini files`);

const patientLookup = await readPatientsCsv();
console.log(`Loaded ${patientLookup.size} patients for lookup`);

const tenantLookup = await readTenantsCsv();
console.log(`Loaded ${tenantLookup.size} tenants for lookup`);

const insolePlanLookup = await readInsolePlansCsv();
console.log(`Loaded ${insolePlanLookup.size} insole plans for lookup`);

const scanLookup = await readScansCsv();
console.log(`Loaded ${scanLookup.size} scans for lookup`);

const orders: PESOrderData[] = [];
let parseErrors = 0;

for (let i = 0; i < orderFiles.length; i++) {
  try {
    orders.push(parseAuftragForOrder(orderFiles[i]));
  } catch (error) {
    parseErrors++;
    console.error(`Failed to parse ${orderFiles[i]}: ${error instanceof Error ? error.message : error}`);
  }

  if ((i + 1) % PROGRESS_LOG_INTERVAL === 0) {
    console.log(`Parsed ${i + 1}/${orderFiles.length} files...`);
  }
}

console.log(`Parsing complete: ${orders.length} parsed, ${parseErrors} errors`);

const result = writeOrdersCsv(orders, patientLookup, tenantLookup, insolePlanLookup, scanLookup);

const iacDir = path.dirname(IAC_ORDERS_CSV_PATH);
if (existsSync(iacDir)) {
  copyFileSync(ORDERS_OUTPUT_PATH, IAC_ORDERS_CSV_PATH);
  console.log(`Copied CSV to ${IAC_ORDERS_CSV_PATH}`);
} else {
  console.warn(`IAC directory not found, skipping copy: ${iacDir}`);
}

writeImportLog(result, orderFiles.length, parseErrors);
```

- [ ] **Step 2: Commit**

```bash
git add pes-import-script/src/orders/orders.ts
git commit -m "add orders main script"
```

---

### Task 6: Verify by running the script

- [ ] **Step 1: Run the script**

```bash
cd pes-import-script && npx tsx src/orders/orders.ts
```

Expected output: console logs showing file counts, loaded lookups, parsing progress, created/skipped counts. An `output/orders/orders.csv` file should be generated.

- [ ] **Step 2: Verify output CSV headers**

Check that the first line of the output CSV matches `ORDER_CSV_HEADERS`:

```bash
head -1 output/orders/orders.csv
```

Expected: `id;order_number;external_order_number;manager_user_id;status;material;production_method;created_at;confirmed_at;attachments;manager_tenant_id;manager_tenant_name;manager_tenant_ref;workshop_tenant_id;workshop_tenant_ref;version_number;consult_id;insole_plan_id;shipping_target;is_urgent;rework_reason;scan_2d_templates;scan_3d_templates;scan_pp_templates;search_terms`

- [ ] **Step 3: Spot-check a data row**

```bash
head -3 output/orders/orders.csv
```

Verify: `id` starts with `order-`, `order_number` matches `kundennummer-mig-1-N` pattern, `status` is `SHIPPED`, `production_method` is `MILLING` or `PRINTING`.

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A && git commit -m "fix: orders script adjustments from verification"
```

Only run this if changes were made in this task.
