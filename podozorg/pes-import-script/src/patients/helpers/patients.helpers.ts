import fs from 'node:fs';
import path from 'node:path';
import ini from 'ini';
import csv from 'csv-parser';
import type { PESPatientData } from '../interfaces/pes-patient-data.interface.ts';
import { EPatientGender, EPatientStatus, EPatientTitle } from '../../shared/generated.ts';
import { AUFTRAG_FILENAME_REGEX, KUNDENNUMMER_FILENAME_REGEX, ORDERS_DATA_PATH, PATIENT_CSV_HEADERS, PATIENTS_IAC_OUTPUT_PATH, PATIENTS_OUTPUT_PATH, TENANTS_CSV_PATH } from '../patients.config.ts';

export function formatDateOfBirth(date: string): string {
  const [day, month, year] = date.split('.');
  return `${year}-${month}-${day}`;
}

export function mapAnredeToGender(anrede: string | undefined): string {
  if (!anrede) return EPatientGender.Unknown;

  const normalized = anrede.trim().toLowerCase();
  if (normalized === 'dhr') return EPatientGender.Male;
  if (normalized === 'mw') return EPatientGender.Female;
  return EPatientGender.Unknown;
}

const TITLE_MAP: Record<string, string> = {
  mr: EPatientTitle.Mr,
  mrs: EPatientTitle.Mrs,
  ms: EPatientTitle.Ms,
  miss: EPatientTitle.Miss,
  mx: EPatientTitle.Mx,
  dr: EPatientTitle.Dr,
  prof: EPatientTitle.Prof,
};

export function mapStringToPatientTitle(titel: string | undefined): string {
  if (!titel) return EPatientTitle.Other;

  const normalized = titel.trim().toLowerCase();
  return TITLE_MAP[normalized] ?? EPatientTitle.Other;
}

const COUNTRY_MAP: Record<string, string> = {
  ned: 'NL',
};

export function mapCountry(land: string | undefined): string {
  if (!land) return '';

  const normalized = land.trim().toLowerCase();
  return COUNTRY_MAP[normalized] ?? land.trim();
}

export function validatePesPatientData(value: unknown): value is PESPatientData {
  if (typeof value !== 'object' || value === null) return false;
  const data = value as PESPatientData;
  return typeof data.kundennummer === 'string'
    && typeof data.pNummer === 'string'
    && typeof data.pName === 'string'
    && typeof data.pGeb === 'string';
}

export function readOrderFiles(): string[] {
  const files = fs.readdirSync(ORDERS_DATA_PATH, 'utf-8');

  return files
    .filter((file) => AUFTRAG_FILENAME_REGEX.test(file))
    .sort((a, b) => b.localeCompare(a));
}

export function extractKundennummer(fileName: string): string | undefined {
  const match = fileName.match(KUNDENNUMMER_FILENAME_REGEX);
  return match?.[1];
}

export function filterOrderFilesByKnownTenants(
  orderFiles: string[],
  tenantLookup: Map<string, string>,
): { knownFiles: string[]; skippedUnknownTenant: number; unknownTenantCounts: Map<string, number> } {
  const knownFiles: string[] = [];
  const unknownTenantCounts = new Map<string, number>();

  for (const file of orderFiles) {
    const kundennummer = extractKundennummer(file);
    if (!kundennummer || !tenantLookup.has(kundennummer)) {
      const key = kundennummer ?? 'unknown';
      unknownTenantCounts.set(key, (unknownTenantCounts.get(key) ?? 0) + 1);
      continue;
    }
    knownFiles.push(file);
  }

  if (unknownTenantCounts.size > 0) {
    console.warn(`Skipped ${orderFiles.length - knownFiles.length} files from ${unknownTenantCounts.size} unknown tenant(s)`);
  }

  return { knownFiles, skippedUnknownTenant: orderFiles.length - knownFiles.length, unknownTenantCounts };
}

export function parseAuftragFile(fileName: string): PESPatientData {
  const filePath = path.join(ORDERS_DATA_PATH, fileName);
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString('utf16le').replace(/^\uFEFF/, '');
  const parsed = ini.parse(content);

  const auftrag = parsed['Auftrag'] ?? {};
  const kunde = parsed['Kunde'] ?? {};

  return {
    kundennummer: String(auftrag['Kundennummer'] ?? '').trim(),
    pNummer: String(kunde['P_Nummer'] ?? '').trim(),
    pName: String(kunde['P_Name'] ?? '').trim(),
    pVorname: String(kunde['P_Vorname'] ?? '').trim() || undefined,
    pGeb: String(kunde['P_Geb'] ?? '').trim(),
    anrede: String(kunde['ANREDE'] ?? '').trim() || undefined,
    titel: String(kunde['TITEL'] ?? '').trim() || undefined,
    strasse: String(kunde['STRASSE'] ?? '').trim() || undefined,
    hausnummer: String(kunde['HAUSNUMMER'] ?? '').trim() || undefined,
    plz: String(kunde['PLZ'] ?? '').trim() || undefined,
    ort: String(kunde['ORT'] ?? '').trim() || undefined,
    land: String(kunde['LAND'] ?? '').trim() || undefined,
    telefon: String(kunde['TELEFON'] ?? '').trim() || undefined,
    mobil: String(kunde['MOBIL'] ?? '').trim() || undefined,
    mail: String(kunde['MAIL'] ?? '').trim() || undefined,
    info: String(kunde['INFO'] ?? '').trim() || undefined,
  };
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

interface ValidatedPatient {
  patient: PESPatientData;
  tenantRef: string;
}

export function filterValidPatients(
  patients: PESPatientData[],
  tenantLookup: Map<string, string>,
): { validPatients: ValidatedPatient[]; skippedNoTenant: number } {
  const validPatients: ValidatedPatient[] = [];
  let skippedNoTenant = 0;

  for (const patient of patients) {
    const tenantRef = tenantLookup.get(patient.kundennummer);
    if (!tenantRef) {
      console.warn(`Skipping patient ${patient.pNummer}: tenant ${patient.kundennummer} not found in tenants CSV`);
      skippedNoTenant++;
      continue;
    }
    validPatients.push({ patient, tenantRef });
  }

  return { validPatients, skippedNoTenant };
}

export function mapPatientsToCsvRows(validPatients: ValidatedPatient[]): string[] {
  const dataRows: string[] = [];
  let counter = 1;

  for (const { patient, tenantRef } of validPatients) {
    const id = `podozorg-${patient.pNummer}`;
    const patientNumber = String(counter);
    const externalId = patient.pNummer;
    const dateOfBirth = formatDateOfBirth(patient.pGeb);
    const country = mapCountry(patient.land);
    const title = mapStringToPatientTitle(patient.titel);
    const gender = mapAnredeToGender(patient.anrede);

    const searchTerms = [
      id, externalId, patient.pName, patientNumber,
      patient.hausnummer, patient.plz,
      patient.telefon, patient.mobil,
      patient.mail, dateOfBirth,
    ].filter(Boolean).join(',');

    const values: Record<string, string> = {
      id,
      patient_number: patientNumber,
      tenant_ref: tenantRef,
      tenant_id: patient.kundennummer,
      external_id: externalId,
      first_name: patient.pVorname ?? '',
      last_name: patient.pName,
      salutation: patient.anrede ?? '',
      title,
      street: patient.strasse ?? '',
      house_number: patient.hausnummer ?? '',
      postal_code: patient.plz ?? '',
      city: patient.ort ?? '',
      country,
      phone: patient.telefon ?? '',
      mobile: patient.mobil ?? '',
      email: patient.mail ?? '',
      date_of_birth: dateOfBirth,
      status: EPatientStatus.Active,
      gender,
      notes: patient.info ?? '',
      search_terms: searchTerms,
    };

    dataRows.push(PATIENT_CSV_HEADERS.map((header) => values[header] ?? '').join(';'));
    counter++;
  }

  return dataRows;
}

export function writePatientsCsv(
  patients: PESPatientData[],
  tenantLookup: Map<string, string>,
): {
  created: number;
  skippedDuplicates: number;
  skippedNoTenant: number;
  skippedInvalid: number;
} {
  const seenPatients = new Set<string>();
  const uniquePatients: PESPatientData[] = [];
  let skippedInvalid = 0;
  let skippedDuplicates = 0;

  for (const patient of patients) {
    if (!validatePesPatientData(patient)) {
      skippedInvalid++;
      continue;
    }
    if (seenPatients.has(patient.pNummer)) {
      skippedDuplicates++;
      continue;
    }
    seenPatients.add(patient.pNummer);
    uniquePatients.push(patient);
  }

  const { validPatients, skippedNoTenant } = filterValidPatients(uniquePatients, tenantLookup);
  const dataRows = mapPatientsToCsvRows(validPatients);

  const csvData = [PATIENT_CSV_HEADERS.join(';'), ...dataRows].join('\n');
  const dir = path.dirname(PATIENTS_OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PATIENTS_OUTPUT_PATH, csvData, 'utf-8');

  const iacDir = path.dirname(PATIENTS_IAC_OUTPUT_PATH);
  if (fs.existsSync(iacDir)) {
    fs.copyFileSync(PATIENTS_OUTPUT_PATH, PATIENTS_IAC_OUTPUT_PATH);
  }

  return { created: dataRows.length, skippedDuplicates, skippedNoTenant, skippedInvalid };
}
