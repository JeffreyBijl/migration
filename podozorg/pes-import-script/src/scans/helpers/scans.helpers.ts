import fs from 'node:fs';
import path from 'node:path';
import ini from 'ini';
import csv from 'csv-parser';
import { EScanDevice, EScanModality } from '../../shared/generated.ts';
import { AUFTRAG_FILENAME_REGEX, DICOM_INPUT_PATH, ORDERS_DATA_PATH, SCAN_BASE_REGEX, SCAN_CSV_HEADERS, SCAN_FILE_REGEX, SCAN_PIXELS_PER_INCH, SCAN_USER_ID, SCANS_IAC_OUTPUT_PATH, SCANS_OUTPUT_PATH, SPLIT_SCANS_INPUT_PATH, TENANTS_CSV_PATH } from '../scans.config.ts';
import type { ScanGroup, ScanStats, ValidatedScanGroup } from '../interfaces/scan-group.interface.ts';

export function extractATFromFileName(base: string): string {
  const parts = base.split('_');
  return parts.slice(2).join('_');
}

export function extractKundennummerFromAT(at: string): string {
  return at.split('-')[0];
}

export function buildScanUrl(tenantRef: string, type: string, side: string, base: string, ext: string): string {
  return `${tenantRef}/${base}.FS2D.${type}${side}.${ext}`;
}

export function buildThumbnailUrl(tenantRef: string, side: string, base: string): string {
  return `${tenantRef}/${base}.FS2D.thumb${side}.jpg`;
}

export function formatSortKeyDate(isoDate: string): string {
  return isoDate.replace(/:/g, '');
}

export function createSortKey(tenantRef: string, isoDate: string): string {
  return `${tenantRef}#${formatSortKeyDate(isoDate)}`;
}

export function readScanFiles(): string[] {
  const inputPaths = [SPLIT_SCANS_INPUT_PATH, DICOM_INPUT_PATH];
  const allFiles: string[] = [];
  for (const inputPath of inputPaths) {
    if (!fs.existsSync(inputPath)) {
      console.warn(`Scan input folder not found, skipping: ${inputPath}`);
      continue;
    }
    const files = fs.readdirSync(inputPath, 'utf-8');
    allFiles.push(...files);
  }
  return allFiles.filter((file) => SCAN_FILE_REGEX.test(file));
}

export function groupScanFiles(files: string[]): ScanGroup[] {
  const groups = new Map<string, string[]>();
  for (const file of files) {
    const match = file.match(SCAN_BASE_REGEX);
    if (!match) continue;
    const base = match[1];
    if (!groups.has(base)) {
      groups.set(base, []);
    }
    groups.get(base)!.push(file);
  }
  const result: ScanGroup[] = [];
  for (const [base, groupFiles] of groups) {
    const at = extractATFromFileName(base);
    const kundennummer = extractKundennummerFromAT(at);
    result.push({ base, at, kundennummer, files: groupFiles });
  }
  return result;
}

export function extractDateFromFileName(base: string): string {
  const dateStr = base.substring(0, 8);
  const timeStr = base.substring(9, 15);
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  const seconds = timeStr.substring(4, 6);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}

export function readTenantsCsv(): Promise<Map<string, string>> {
  return new Promise((resolve, reject) => {
    const lookup = new Map<string, string>();
    fs.createReadStream(TENANTS_CSV_PATH)
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

export function buildAuftragLookup(): Map<string, string> {
  const files = fs.readdirSync(ORDERS_DATA_PATH, 'utf-8');
  const auftragFiles = files.filter((file) => AUFTRAG_FILENAME_REGEX.test(file));
  const lookup = new Map<string, string>();
  for (const fileName of auftragFiles) {
    const filePath = path.join(ORDERS_DATA_PATH, fileName);
    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString('utf16le').replace(/^\uFEFF/, '');
    const parsed = ini.parse(content);
    const kunde = parsed['Kunde'] ?? {};
    const pNummer = String(kunde['P_Nummer'] ?? '').trim();
    if (!pNummer) continue;
    // Extract AT from Auftrag filename: {date}_{time}_{AT}_Auftrag.ini
    const parts = fileName.replace('_Auftrag.ini', '').split('_');
    const at = parts.slice(2).join('_');
    lookup.set(at, pNummer);
  }
  return lookup;
}

export function filterValidScanGroups(
  groups: ScanGroup[],
  tenantLookup: Map<string, string>,
  auftragLookup: Map<string, string>,
): { validGroups: ValidatedScanGroup[]; stats: Pick<ScanStats, 'skippedNoTenant' | 'skippedNoAuftrag' | 'unknownTenantCounts' | 'unknownAuftragATs'> } {
  const validGroups: ValidatedScanGroup[] = [];
  let skippedNoTenant = 0;
  let skippedNoAuftrag = 0;
  const unknownTenantCounts = new Map<string, number>();
  const unknownAuftragATs: string[] = [];

  for (const group of groups) {
    const tenantRef = tenantLookup.get(group.kundennummer);
    if (!tenantRef) {
      skippedNoTenant++;
      unknownTenantCounts.set(group.kundennummer, (unknownTenantCounts.get(group.kundennummer) ?? 0) + 1);
      continue;
    }
    const pNummer = auftragLookup.get(group.at);
    if (!pNummer) {
      skippedNoAuftrag++;
      unknownAuftragATs.push(group.at);
      continue;
    }
    validGroups.push({ group, tenantRef, pNummer });
  }

  return { validGroups, stats: { skippedNoTenant, skippedNoAuftrag, unknownTenantCounts, unknownAuftragATs } };
}

function buildScanFileUrl(
  group: ScanGroup,
  tenantRef: string,
  fileName: string,
  type: string,
  side: string,
  ext: string,
): string {
  return group.files.includes(fileName) ? buildScanUrl(tenantRef, type, side, group.base, ext) : '';
}

function buildScanThumbnailUrl(group: ScanGroup, tenantRef: string, fileName: string, side: string): string {
  return group.files.includes(fileName) ? buildThumbnailUrl(tenantRef, side, group.base) : '';
}

export function mapScanGroupsToCsvRows(validGroups: ValidatedScanGroup[]): string[] {
  const dataRows: string[] = [];

  for (const { group, tenantRef, pNummer } of validGroups) {
    const date = extractDateFromFileName(group.base);

    const cadLeft = buildScanFileUrl(group, tenantRef, `${group.base}.FS2D.cadLeft.jpg`, 'cad', 'Left', 'jpg');
    const cadRight = buildScanFileUrl(group, tenantRef, `${group.base}.FS2D.cadRight.jpg`, 'cad', 'Right', 'jpg');
    const dicomLeft = buildScanFileUrl(group, tenantRef, `${group.base}.FS2D.dicomLeft.dcm`, 'dicom', 'Left', 'dcm');
    const dicomRight = buildScanFileUrl(group, tenantRef, `${group.base}.FS2D.dicomRight.dcm`, 'dicom', 'Right', 'dcm');
    const thumbLeft = buildScanThumbnailUrl(group, tenantRef, `${group.base}.FS2D.thumbLeft.jpg`, 'Left');
    const thumbRight = buildScanThumbnailUrl(group, tenantRef, `${group.base}.FS2D.thumbRight.jpg`, 'Right');

    const values: Record<string, string> = {
      id: `2d-scan-${group.at}`,
      cad_template_url_left: cadLeft,
      cad_template_url_right: cadRight,
      date,
      device: EScanDevice.Scanner2d,
      dicom_url_left: dicomLeft,
      dicom_url_right: dicomRight,
      modality: EScanModality.Feetscan,
      patient_id: `podozorg-${pNummer}`,
      pixels_per_inch: SCAN_PIXELS_PER_INCH,
      tenant_ref: tenantRef,
      'tenant_ref#date': createSortKey(tenantRef, date),
      thumbnail_url_left: thumbLeft,
      thumbnail_url_right: thumbRight,
      user_id: SCAN_USER_ID,
    };

    dataRows.push(SCAN_CSV_HEADERS.map((header) => values[header] ?? '').join(';'));
  }

  return dataRows;
}

export async function writeScansCsv(): Promise<{
  totalFiles: number;
  groupsFormed: number;
  stats: ScanStats;
}> {
  const scanFiles = readScanFiles();
  const groups = groupScanFiles(scanFiles);
  const tenantLookup = await readTenantsCsv();
  const auftragLookup = buildAuftragLookup();

  const { validGroups, stats: filterStats } = filterValidScanGroups(groups, tenantLookup, auftragLookup);
  const dataRows = mapScanGroupsToCsvRows(validGroups);

  const csvData = [SCAN_CSV_HEADERS.join(';'), ...dataRows].join('\n');
  const dir = path.dirname(SCANS_OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SCANS_OUTPUT_PATH, csvData, 'utf-8');

  const iacDir = path.dirname(SCANS_IAC_OUTPUT_PATH);
  if (fs.existsSync(iacDir)) {
    fs.copyFileSync(SCANS_OUTPUT_PATH, SCANS_IAC_OUTPUT_PATH);
  }

  return {
    totalFiles: scanFiles.length,
    groupsFormed: groups.length,
    stats: { created: dataRows.length, ...filterStats },
  };
}
