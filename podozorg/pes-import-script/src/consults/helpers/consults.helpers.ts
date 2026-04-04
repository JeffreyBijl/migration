import fs from 'node:fs';
import path from 'node:path';
import ini from 'ini';
import csv from 'csv-parser';
import { EConsultStatus, EFootType } from '../../shared/generated.ts';
import type { PESConsultData } from '../interfaces/pes-consultsdata.interface.ts';
import {
  AUFTRAG_FILENAME_REGEX,
  CONSULT_CSV_HEADERS,
  CONSULT_USER_ID,
  CONSULTS_OUTPUT_PATH,
  DIAGNOSES_JSON_PATH,
  ORDERS_DATA_PATH,
  PATIENTS_CSV_PATH,
  SCANS_CSV_PATH,
} from '../consults.config.ts';

export function readDiagnosesMap(): Map<string, string> {
  const content = fs.readFileSync(DIAGNOSES_JSON_PATH, 'utf-8');
  const json = JSON.parse(content);
  const diagnoses: Record<string, string> = json.diagnoses;

  const reversed = new Map<string, string>();

  for (const [enumKey, dutchValue] of Object.entries(diagnoses)) {
    const key = dutchValue.toLowerCase();
    if (reversed.has(key)) {
      console.warn(`Duplicate diagnosis key detected: "${key}" (existing: ${reversed.get(key)}, new: ${enumKey})`);
    }
    reversed.set(key, enumKey);
  }

  return reversed;
}

export function mapDiagnose(
  value: string | undefined,
  diagnosesMap: Map<string, string>
): { result: string; unmatched: string | undefined } {
  if (!value || !value.trim()) return { result: '', unmatched: undefined };

  const strippedValue = value.replace(/\/\/.*$/, '').trim();
  if (!strippedValue) return { result: '', unmatched: undefined };

  const normalized = strippedValue.toLowerCase().replace(/_/g, ' ');
  const enumKey = diagnosesMap.get(normalized);

  if (enumKey) return { result: enumKey, unmatched: undefined };
  return { result: 'NO_DIAGNOSIS', unmatched: strippedValue };
}

export function mapFootType(value: string | undefined): string {
  if (!value) return '';

  const normalized = value.trim().toLowerCase();
  if (normalized === 'hohlfuss') return EFootType.Cavus;
  if (normalized === 'normalfuss') return EFootType.Rectus;
  if (normalized === 'plattfuss') return EFootType.Planus;
  return '';
}

export function formatCreatedDate(value: string): string {
  const [datePart, timePart = '00:00:00'] = value.trim().split(/\s+/);
  const [day, month, year] = datePart.split('.');
  return new Date(`${year}-${month}-${day}T${timePart}`).toISOString();
}

export function createSortKey(tenantRef: string, date: string, id: string): string {
  return `${tenantRef}#${date}#${id}`;
}

export function readOrderFiles(): string[] {
  const files = fs.readdirSync(ORDERS_DATA_PATH, 'utf-8');

  return files.filter((file) => AUFTRAG_FILENAME_REGEX.test(file)).sort((a, b) => b.localeCompare(a));
}

export function parseAuftragForConsultation(fileName: string): PESConsultData {
  const filePath = path.join(ORDERS_DATA_PATH, fileName);
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString('utf16le').replace(/^\uFEFF/, '');
  const parsed = ini.parse(content);

  const auftrag = parsed['Auftrag'] ?? {};
  const kunde = parsed['Kunde'] ?? {};
  const diagnoseSection = parsed['Diagnose'] ?? {};
  const fusstypSection = parsed['Fusstyp'] ?? {};

  return {
    at: String(auftrag['AT'] ?? '').trim(),
    erstellt: String(auftrag['Erstellt'] ?? '').trim(),
    pNummer: String(kunde['P_Nummer'] ?? '').trim(),
    diagnose: String(diagnoseSection['Diagnose'] ?? '').trim() || undefined,
    fusstyp: String(fusstypSection['Typ'] ?? '').trim() || undefined,
  };
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

export function validateConsultationData(value: unknown): value is PESConsultData {
  if (typeof value !== 'object' || value === null) return false;
  const data = value as PESConsultData;
  return (
    typeof data.at === 'string' &&
    !!data.at &&
    typeof data.pNummer === 'string' &&
    !!data.pNummer &&
    typeof data.erstellt === 'string' &&
    !!data.erstellt
  );
}

interface ValidatedConsult {
  data: PESConsultData;
  patientId: string;
  tenantRef: string;
}

export function filterValidConsults(
  consults: PESConsultData[],
  patientLookup: Map<string, string>
): { validConsults: ValidatedConsult[]; skippedNoPatient: number } {
  const validConsults: ValidatedConsult[] = [];
  let skippedNoPatient = 0;

  for (const data of consults) {
    const patientId = 'podozorg-' + data.pNummer.trim();
    const tenantRef = patientLookup.get(patientId);
    if (!tenantRef) {
      console.warn(`Skipping consultation ${data.at}: patient ${patientId} not found in patients CSV`);
      skippedNoPatient++;
      continue;
    }
    validConsults.push({ data, patientId, tenantRef });
  }

  return { validConsults, skippedNoPatient };
}

export function mapConsultsToCsvRows(
  validConsults: ValidatedConsult[],
  scanLookup: Map<string, string>,
  diagnosesMap: Map<string, string>
): { dataRows: string[]; unmatchedDiagnoses: Map<string, number> } {
  const dataRows: string[] = [];
  const unmatchedDiagnoses = new Map<string, number>();

  for (const { data, patientId, tenantRef } of validConsults) {
    const scanId = scanLookup.get(data.at);
    const scanTemplates = scanId ? `[${scanId}]` : '[]';

    const { result: diagnosis, unmatched } = mapDiagnose(data.diagnose, diagnosesMap);
    if (unmatched) {
      unmatchedDiagnoses.set(unmatched, (unmatchedDiagnoses.get(unmatched) ?? 0) + 1);
    }

    const footType = mapFootType(data.fusstyp);
    const date = formatCreatedDate(data.erstellt);
    const id = 'consult-' + data.at;
    const sortKey = createSortKey(tenantRef, date, id);

    const values: Record<string, string> = {
      id,
      patient_id: patientId,
      status: EConsultStatus.OrderCreated,
      date,
      tenant_ref: tenantRef,
      'tenant_ref#date#id': sortKey,
      user_id: CONSULT_USER_ID,
      profile_b_diagnosis: diagnosis,
      profile_b_foot_type_left: footType,
      profile_b_foot_type_right: footType,
      scan_2d_templates: scanTemplates,
      active_assessment: '',
      additional_tests: '',
      complaints: '[]',
      conclusion: '',
      diagnosis: '',
      dynamic_analyse_remark: '',
      enable_reminder: 'false',
      essential_info: '[]',
      essential_info_notes: '',
      evaluation_date: '',
      evaluation_name: '',
      evaluation_notes: '',
      exercises: '',
      follow_up_comments: '',
      general_inspection: '',
      hobbies: '[]',
      insole_notes: '',
      main_goal: '',
      notes: '',
      occupations: '[]',
      passive_assessment: '',
      pathologies: '[]',
      profile_b_notes: '',
      recovery: '',
      referrals: '',
      referring_practitioner: '',
      remarks: '',
      resistance_tests: '',
      satisfaction: '',
      scan_3d_templates: '[]',
      scan_pp_templates: '[]',
      shoe_advise: '',
      shoes: '[]',
      sports: '[]',
    };

    dataRows.push(CONSULT_CSV_HEADERS.map((h) => values[h] ?? '').join(';'));
  }

  return { dataRows, unmatchedDiagnoses };
}

export function writeConsultsCsv(
  consults: PESConsultData[],
  patientLookup: Map<string, string>,
  scanLookup: Map<string, string>,
  diagnosesMap: Map<string, string>
): { created: number; skippedInvalid: number; skippedNoPatient: number; unmatchedDiagnoses: Map<string, number> } {
  let skippedInvalid = 0;
  const validatedConsults: PESConsultData[] = [];

  for (const consult of consults) {
    if (!validateConsultationData(consult)) {
      skippedInvalid++;
      continue;
    }
    validatedConsults.push(consult);
  }

  const { validConsults, skippedNoPatient } = filterValidConsults(validatedConsults, patientLookup);
  const { dataRows, unmatchedDiagnoses } = mapConsultsToCsvRows(validConsults, scanLookup, diagnosesMap);

  const csvData = [CONSULT_CSV_HEADERS.join(';'), ...dataRows].join('\n');
  fs.mkdirSync(path.dirname(CONSULTS_OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(CONSULTS_OUTPUT_PATH, csvData, 'utf-8');

  return { created: dataRows.length, skippedInvalid, skippedNoPatient, unmatchedDiagnoses };
}
