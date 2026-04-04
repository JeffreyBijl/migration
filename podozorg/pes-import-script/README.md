# PES Import Script

Migration script for importing tenant and scan data from PES (Podozorg) into the Insolution platform.

## Scan pipeline

The scan migration consists of three steps that feed into each other. Each step reads its input from the output of the previous step:

```
utils/split-scans/img/          (raw scan images)
        |
        v
  1. split-scans                (split left/right + generate thumbnails)
        |
        v
utils/split-scans/output/       (JPGs + thumbnails)
        |
        v
  2. convert-to-dicom           (convert JPGs to DICOM)
        |
        v
utils/split-scans/dicom/        (DCM files)
        |
        v
  3. PES-import-script           (generate scans CSV for import)
        |
        v
PES-import-script/output/scans/scans.csv
```

### Step 1: Split scans

Splits raw scan images into left/right halves and generates thumbnails.

```bash
cd utils/split-scans
npm install
npm start
```

- Input: `utils/split-scans/img/` (raw scan images)
- Output: `utils/split-scans/output/` (split JPGs + thumbnails)

### Step 2: Convert to DICOM

Converts the split JPG scans to DICOM format. Point `--dir` at the split-scans output:

```bash
cd utils/convert-to-dicom
npm install
npm start -- --dir ../split-scans/output
```

- Input: `utils/split-scans/output/` (JPGs from step 1)
- Output: `utils/split-scans/dicom/` (DCM files)

### Step 3: Import scans

Generates the scans CSV for Insolution import. Reads directly from the output folders of step 1 and 2 — no manual copying needed.

```bash
cd PES-import-script
npm run import-scans
```

- Input: `utils/split-scans/output/` (JPGs + thumbnails) and `utils/split-scans/dicom/` (DCMs)
- Output: `PES-import-script/output/scans/scans.csv`

## What does it do?

### Tenant import

Reads tenant data from `data/tenants/tenants-data.json` and generates a CSV file (`output/tenants/tenants.csv`) that can be used for import into Insolution.

The script:

1. Validates tenant data (requires `tenantObseleteID` and `tenantName`)
2. Filters duplicates based on ID and name
3. Generates a CSV with all valid, unique tenants
4. Logs the result to the console and to a log file in `output/tenants/logs/`

Invalid and duplicate tenants are skipped and shown in the output.

## Requirements

- Node.js v22+ (for `--experimental-strip-types`)

## Installation

```bash
npm install
```

## Usage

```bash
npm run import-tenants
npm run import-scans
```

## Testing

```bash
npm test
```

## Project structure

```
data/tenants/tenants-data.json        # Input: tenant data from PES
data/orders/                          # Input: Auftrag .ini files
output/tenants/tenants.csv            # Output: generated tenants CSV
output/tenants/logs/                  # Output: log files per run
output/scans/scans.csv                # Output: generated scans CSV
src/tenants/                          # Tenant import logic
src/scans/                            # Scan import logic
```
