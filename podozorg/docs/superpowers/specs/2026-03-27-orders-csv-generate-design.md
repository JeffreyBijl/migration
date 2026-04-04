# Orders CSV Generate Script — Design Spec

## Goal

Generate an `orders.csv` file from Podozorg Auftrag.ini files, following the field mapping defined in `pes-import-script/mapping/orders.csv`. The script follows the same architecture as existing migration modules (consults, insole-plans, patients, scans).

## Module Structure

```
src/orders/
├── orders.ts                    # Main script: orchestration + logging
├── orders.config.ts             # Constants, paths, headers, mappings
├── helpers/
│   └── orders.helpers.ts        # All logic: filter → map → write + CSV readers
└── interfaces/
    └── orders.interface.ts      # All interfaces and types
```

## Data Flow

```
Auftrag.ini files
       │
       ▼
  parseAuftragForOrder()        → PESOrderData[]
       │
       ▼
  filterValidOrders()           → ValidatedOrder[]
  ├── patient lookup (patients.csv)
  ├── tenant lookup (tenants.csv)
  ├── insole plan lookup (insole-plans.csv)
  └── duplicate AT detection
       │
       ▼
  mapOrdersToCsvRows()          → string[]
  ├── order_number counter per kundennummer
  ├── shipping target mapping
  ├── workshop resolution via production_method
  └── scan lookup (scans.csv)
       │
       ▼
  writeOrdersCsv()              → OrderWriteResult
```

## Config (`orders.config.ts`)

### Paths

| Constant                | Value                                           |
|-------------------------|-------------------------------------------------|
| `ORDERS_DATA_PATH`      | `data/orders`                                   |
| `PATIENTS_CSV_PATH`     | `output/patients/patients.csv`                  |
| `TENANTS_CSV_PATH`      | `output/tenants/tenants.csv`                    |
| `INSOLE_PLANS_CSV_PATH` | `output/insole-plans/insole-plans.csv`           |
| `SCANS_CSV_PATH`        | `output/scans/scans.csv`                        |
| `ORDERS_OUTPUT_PATH`    | `output/orders/orders.csv`                      |
| `IAC_ORDERS_CSV_PATH`   | `../../../../iac/scripts/orders/orders.csv`     |
| `ORDERS_LOG_DIR`        | `output/orders/logs`                            |

### Constants

| Constant                  | Value                                          |
|---------------------------|------------------------------------------------|
| `AUFTRAG_FILENAME_REGEX`  | `/^\d{8}_\d{6}_.*_Auftrag\.ini$/`              |
| `PROGRESS_LOG_INTERVAL`   | `1000`                                         |
| `ORDER_USER_ID`           | `'migration-user'`                             |
| `MIGRATION_BATCH`         | `1`                                            |
| `ORDER_MATERIAL`          | `''` (TODO: meaning of this field is unclear)  |

### Workshop Config

Static values, same for all orders:

```typescript
WORKSHOP_CONFIG = {
  millingTenantId: 'ws-insolution-nijverdal',
  millingTenantRef: 'ws-root.ws-insolution.ws-insolution-nijverdal.',
  printingTenantId: 'ws-insolution-nijverdal',
  printingTenantRef: 'ws-root.ws-insolution.ws-insolution-nijverdal.',
}
```

### Shipping Target Mapping

Configurable mapping from `Versandadresse.NAME` to `EShippingTarget`. Default: `EShippingTarget.Tenant`.

```typescript
SHIPPING_TARGET_MAP: Record<string, EShippingTarget> = {
  // Fill in with known Versandadresse.NAME values as they are discovered
}
SHIPPING_TARGET_DEFAULT = EShippingTarget.Tenant
```

### CSV Headers

All 28 output fields from the mapping document:

```typescript
ORDER_CSV_HEADERS = [
  'id', 'order_number', 'external_order_number', 'manager_user_id',
  'status', 'material', 'production_method', 'created_at', 'confirmed_at',
  'attachments', 'manager_tenant_id', 'manager_tenant_name',
  'manager_tenant_ref', 'workshop_tenant_id', 'workshop_tenant_ref',
  'version_number', 'consult_id', 'insole_plan_id', 'shipping_target',
  'is_urgent', 'rework_reason', 'scan_2d_templates', 'scan_3d_templates',
  'scan_pp_templates', 'search_terms',
]
```

## Interfaces (`orders.interface.ts`)

### `PESOrderData`

Raw data parsed from Auftrag.ini:

- `at: string` — order identifier (AT field)
- `pNummer: string` — patient number
- `kundennummer: string` — client/tenant number
- `erstellt: string` — creation date
- `versandadresseName?: string` — shipping address name
- `versandart?: string` — shipping method (normal/express)
- `bemerkungen: string[]` — remarks from Werkstatt section (for production method)

### `TenantRecord`

Tenant data needed for order mapping:

- `id: string`
- `name: string`
- `tenantRef: string`

### `InsolePlanEntry`

Lookup entry from insole-plans.csv:

- `id: string` — the insole plan id
- `productionMethod: string` — MILLING or PRINTING

### `SkipReason`

Union type: `'duplicate' | 'unknownTenant' | 'patientNotFound' | 'noInsolePlan'`

### `OrderValidationResult`

Discriminated union:

- `{ valid: true; patientId: string; tenant: TenantRecord; insolePlanId: string; productionMethod: string }`
- `{ valid: false; reason: SkipReason }`

### `ValidatedOrder`

- `order: PESOrderData`
- `patientId: string`
- `tenant: TenantRecord`
- `insolePlanId: string`
- `productionMethod: string`

### `FilterResult`

- `validOrders: ValidatedOrder[]`
- `skipCounts: Record<SkipReason, number>`

### `OrderWriteResult`

- `created: number`
- `skipCounts: Record<SkipReason, number>`

## Helpers (`orders.helpers.ts`)

### CSV Readers

Each returns a Promise (using `csv-parser` with `{ separator: ';' }`):

| Function              | Return type                      | Key logic                                                |
|-----------------------|----------------------------------|----------------------------------------------------------|
| `readOrderFiles`      | `string[]`                       | Reads + filters on regex + sorts descending              |
| `readPatientsCsv`     | `Map<patientId, tenantRef>`      | Maps `id` → `tenant_ref`                                |
| `readTenantsCsv`      | `Map<tenantRef, TenantRecord>`   | Maps `tenant_ref` → `{ id, name, tenantRef }`           |
| `readInsolePlansCsv`  | `Map<at, InsolePlanEntry>`       | Strips `insoleplan-` prefix from id to get AT key        |
| `readScansCsv`        | `Map<at, scanId>`                | Strips `2d-scan-` prefix from id to get AT key           |

### INI Parsing

`parseAuftragForOrder(fileName: string): PESOrderData`

Reads Auftrag.ini (UTF-16LE with BOM), parses sections:
- `Auftrag` → AT, Kundennummer, Erstellt
- `Kunde` → P_Nummer
- `Werkstatt` → Bemerkungen*, Versandart
- `Versandadresse` → NAME

### Mapping Helpers

| Function                              | Purpose                                                        |
|---------------------------------------|----------------------------------------------------------------|
| `determineProductionMethod(bemerkungen)` | `3d print` in any remark → PRINTING, otherwise MILLING        |
| `mapShippingTarget(name)`             | Lookup in `SHIPPING_TARGET_MAP`, fallback `SHIPPING_TARGET_DEFAULT` |
| `formatCreatedDate(value)`            | German date format → ISO string                                |

### Pipeline Functions

**`validateOrder(order, patientLookup, tenantLookup, insolePlanLookup, seenATs)`**

Validation chain with early returns:
1. Duplicate AT? → skip `'duplicate'`
2. Patient `podozorg-{{ pNummer }}` not in patientLookup? → skip `'patientNotFound'`
3. Tenant not found via patient's tenantRef? → skip `'unknownTenant'`
4. No insole plan for this AT? → skip `'noInsolePlan'`
5. All valid → return tenant, patientId, insolePlanId, productionMethod

**`filterValidOrders(orders, patientLookup, tenantLookup, insolePlanLookup)`**

Iterates all orders, calls `validateOrder`, collects valid orders and skip counts.

**`mapOrdersToCsvRows(validOrders, scanLookup)`**

For each validated order:
- Generates `order_number`: `{{ kundennummer }}-mig-{{ MIGRATION_BATCH }}-{{ counter }}` with a `Map<kundennummer, number>` counter
- Resolves workshop tenant id/ref from `WORKSHOP_CONFIG` based on `productionMethod`
- Maps shipping target via `mapShippingTarget`
- Determines `is_urgent`: `versandart !== 'normal'`
- Looks up `scan_2d_templates` from scanLookup
- Sets static values: `status` = `EOrderStatus.Shipped`, `version_number` = `1`, `manager_user_id` = `ORDER_USER_ID`, empty arrays for `scan_3d_templates` and `scan_pp_templates`, etc.
- Builds `search_terms`: `[order_number, manager_user_id].join(', ')`

**`writeOrdersCsv(orders, patientLookup, tenantLookup, insolePlanLookup, scanLookup)`**

Thin orchestrator: `filterValidOrders` → `mapOrdersToCsvRows` → write CSV file. Returns `OrderWriteResult`.

## Main Script (`orders.ts`)

1. Read all lookup CSVs (patients, tenants, insole-plans, scans) + Auftrag.ini files
2. Parse each Auftrag.ini into `PESOrderData[]` with error counting
3. Call `writeOrdersCsv` with all lookups
4. Log results (created, skip counts per reason)
5. Copy CSV to IAC path if directory exists
6. Write timestamped log file to `ORDERS_LOG_DIR`

## Field Mapping Reference

| Output field             | Source                                                                              |
|--------------------------|-------------------------------------------------------------------------------------|
| `id`                     | `order-{{ AT }}`                                                                    |
| `order_number`           | `{{ kundennummer }}-mig-{{ MIGRATION_BATCH }}-{{ counter }}`                        |
| `external_order_number`  | `{{ AT.trim() }}`                                                                   |
| `manager_user_id`        | `ORDER_USER_ID` (static: `'migration-user'`)                                       |
| `status`                 | `EOrderStatus.Shipped` (static)                                                    |
| `material`               | `ORDER_MATERIAL` (static: `''`, TODO)                                               |
| `production_method`      | From insole-plans.csv via AT lookup                                                 |
| `created_at`             | `formatCreatedDate(Erstellt)`                                                       |
| `confirmed_at`           | `formatCreatedDate(Erstellt)` (same as created_at)                                  |
| `attachments`            | `[]` (static)                                                                       |
| `manager_tenant_id`      | `tenant.id` via patient → tenantRef → tenant lookup                                 |
| `manager_tenant_name`    | `tenant.name` via same lookup                                                       |
| `manager_tenant_ref`     | `tenant.tenantRef` via patient → tenantRef                                          |
| `workshop_tenant_id`     | `WORKSHOP_CONFIG` based on production_method                                        |
| `workshop_tenant_ref`    | `WORKSHOP_CONFIG` based on production_method                                        |
| `version_number`         | `1` (static)                                                                        |
| `consult_id`             | `consult-{{ AT }}`                                                                  |
| `insole_plan_id`         | From insole-plans.csv via AT lookup                                                 |
| `shipping_target`        | `mapShippingTarget(Versandadresse.NAME)`                                            |
| `is_urgent`              | `versandart !== 'normal'`                                                           |
| `rework_reason`          | `''` (static, N/A)                                                                  |
| `scan_2d_templates`      | `[scanId]` from scans.csv via AT, or `[]`                                           |
| `scan_3d_templates`      | `[]` (static)                                                                       |
| `scan_pp_templates`      | `[]` (static)                                                                       |
| `search_terms`           | `[order_number, manager_user_id].join(', ')`                                        |
