import fs from 'node:fs';
import path from 'node:path';
import ini from 'ini';
import {
  EBottomFinish,
  EInfill,
  EProductionMethod,
  ESide,
  EFinishingBy,
  EShoeSizeSystem,
} from '../../shared/generated.ts';
import {
  AUFTRAG_FILENAME_REGEX,
  ORDERS_DATA_PATH,
  INSOLE_PLAN_CSV_HEADERS,
  INSOLE_PLAN_USER_ID,
  INSOLE_PLAN_NAME,
  INSOLE_PLANS_OUTPUT_PATH,
  WORKSHOP_CONFIG,
  BOTTOM_FINISH_ALIASES,
} from '../insole-plans.config.ts';
import type {
  PESInsolePlanData,
  ParsedTherapieplan,
  TherapieplanElement,
  Materialstaerke,
  GroundSoleSettings,
  CombinedElement,
  CombineElementsResult,
  UnmappedElement,
  MappingResult,
  FieldMappingResult,
  RotationValues,
  InsolePlanWriteResult,
  InsolePlanCsvRow,
  OrderValidationResult,
  ValidatedOrder,
  FilterResult,
  SkipReason,
} from '../interfaces/insole-plans.interface.ts';

import { mapCoreMaterial } from '../../../output/pre-scripts/mapCoreMaterial.ts';
import { mapElements } from '../../../output/pre-scripts/mapElements.ts';
import { mapGroundSolePattern } from '../../../output/pre-scripts/mapGroundSolePattern.ts';
import { mapInfill } from '../../../output/pre-scripts/mapInfill.ts';
import { mapInsoleType } from '../../../output/pre-scripts/mapInsoleType.ts';
import { mapTopCoverMaterial } from '../../../output/pre-scripts/mapTopCoverMaterial.ts';

export function parseIniValue(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/\/\/.*$/, '').trim();
}

export function parseIniNumber(value: string | undefined): number {
  const parsed = parseFloat(parseIniValue(value));
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateGroundSoleSettings(materialstaerke: Materialstaerke): GroundSoleSettings {
  const { zehen, ballen, ferse } = materialstaerke;
  return {
    groundSoleThickness: zehen,
    middleHindFoot: ballen - zehen,
    hindFoot: ferse - zehen,
    heelLift: ferse - zehen,
  };
}

export function determineProductionMethod(bemerkungen: string[]): string {
  const has3dPrint = bemerkungen.some((b) => b.toLowerCase().includes('3d print'));
  return has3dPrint ? EProductionMethod.Printing : EProductionMethod.Milling;
}

export function determineSizeSystem(schuhgroesse: string | undefined): string {
  if (!schuhgroesse) return EShoeSizeSystem.Eu;
  const size = parseFloat(schuhgroesse);
  return isNaN(size) || size > 20 ? EShoeSizeSystem.Eu : EShoeSizeSystem.Uk;
}

export function combineElements(
  leftElements: TherapieplanElement[],
  rightElements: TherapieplanElement[],
  mapElementsFn: (name: string) => string,
): CombineElementsResult {
  const combined = new Map<string, { left: TherapieplanElement | null; right: TherapieplanElement | null }>();

  for (const el of leftElements) {
    const key = el.name.trim().toLowerCase();
    combined.set(key, { left: el, right: null });
  }

  for (const el of rightElements) {
    const key = el.name.trim().toLowerCase();
    const existing = combined.get(key);
    if (existing) {
      existing.right = el;
    } else {
      combined.set(key, { left: null, right: el });
    }
  }

  const elements: CombinedElement[] = [];
  const unmapped: UnmappedElement[] = [];

  for (const [key, { left, right }] of combined) {
    const id = mapElementsFn(key);
    if (!id) {
      unmapped.push({
        name: left?.name ?? right?.name ?? key,
        heightLeft: left?.height ?? null,
        heightRight: right?.height ?? null,
      });
      continue;
    }

    elements.push({
      id,
      left: left !== null,
      right: right !== null,
      height_left: left?.height ?? null,
      height_right: right?.height ?? null,
      infill_left: null,
      infill_right: null,
    });
  }

  return { elements, unmapped };
}

export function assembleProductionNotes(bemerkungen: string[], mappingResults: MappingResult[]): string {
  const parts: string[] = [];

  for (const b of bemerkungen) {
    const trimmed = b.trim();
    if (!trimmed) continue;
    const cleaned = trimmed.replace(/^3d\s*print\s*zolen\s*:\s*/i, '').trim();
    if (cleaned) parts.push(cleaned);
  }

  for (const { label, original, mapped } of mappingResults) {
    if (original && !mapped) {
      parts.push(`${label}: ${original}`);
    }
  }

  return parts.join(' ');
}

export function resolveEnumValue(value: string, enumObj: Record<string, string>, aliases?: Record<string, string>): string {
  if (!value) return '';
  const resolved = aliases?.[value] ?? value;
  return Object.values(enumObj).includes(resolved) ? resolved : '';
}

export function formatCreatedDate(value: string): string {
  const [datePart, timePart = '00:00:00'] = value.trim().split(/\s+/);
  const [day, month, year] = datePart.split('.');
  return new Date(`${year}-${month}-${day}T${timePart}Z`).toISOString();
}

export function readOrderFiles(): string[] {
  const files = fs.readdirSync(ORDERS_DATA_PATH, 'utf-8');
  return files.filter((file) => AUFTRAG_FILENAME_REGEX.test(file)).sort((a, b) => b.localeCompare(a));
}

function readIniFile(filePath: string): Record<string, Record<string, string>> {
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString('utf16le').replace(/^\uFEFF/, '');
  return ini.parse(content);
}

export function parseTherapieplan(filePath: string): ParsedTherapieplan {
  const parsed = readIniFile(filePath);

  const elements: TherapieplanElement[] = [];

  for (const sectionName of Object.keys(parsed)) {
    if (!sectionName.startsWith('Element')) continue;
    const section = parsed[sectionName];
    if (parseIniValue(section['Aktiv']) === 'ja') {
      elements.push({
        name: parseIniValue(section['Name']),
        height: parseIniNumber(section['Hoehe']),
      });
    }
  }

  const talonet = parsed['Talonet'];
  if (talonet && parseIniValue(talonet['Use']) === 'ja') {
    elements.push({
      name: 'TALONET',
      height: parseIniNumber(talonet['Hoehe']),
    });
  }

  const ms = parsed['Materialstaerke'] ?? {};
  const materialstaerke = {
    zehen: parseIniNumber(ms['Zehen']),
    ballen: parseIniNumber(ms['Ballen']),
    ferse: parseIniNumber(ms['Ferse']),
  };

  const rotations = {
    supinationHindfoot: parseIniNumber(parsed['Supination_hindfoot']?.['Hoehe']),
    supinationForefoot: parseIniNumber(parsed['Supination_forefoot']?.['Hoehe']),
    pronationHindfoot: parseIniNumber(parsed['Pronation_hindfoot']?.['Hoehe']),
    pronationForefoot: parseIniNumber(parsed['Pronation_forefoot']?.['Hoehe']),
  };

  return { elements, materialstaerke, rotations };
}

function tryParseTherapieplan(filePath: string): ParsedTherapieplan | null {
  try {
    return parseTherapieplan(filePath);
  } catch (err: any) {
    if (err?.code === 'ENOENT') return null;
    throw err;
  }
}

export function parseAuftragForInsolePlan(fileName: string): PESInsolePlanData {
  const filePath = path.join(ORDERS_DATA_PATH, fileName);
  const parsed = readIniFile(filePath);

  const auftrag = parsed['Auftrag'] ?? {};
  const kunde = parsed['Kunde'] ?? {};
  const werkstatt = parsed['Werkstatt'] ?? {};
  const einlagentyp = parsed['Einlagentyp'] ?? {};

  const bemerkungen: string[] = [];
  for (const key of Object.keys(werkstatt)) {
    if (key.toLowerCase().startsWith('bemerkungen')) {
      const val = String(werkstatt[key] ?? '').trim();
      if (val) bemerkungen.push(val);
    }
  }

  const at = String(auftrag['AT'] ?? '').trim();

  const baseName = fileName.replace(/_Auftrag\.ini$/, '');
  const linksPath = path.join(ORDERS_DATA_PATH, `${baseName}_Therapieplan_Links.ini`);
  const rechtsPath = path.join(ORDERS_DATA_PATH, `${baseName}_Therapieplan_Rechts.ini`);

  const therapieplanLinks = tryParseTherapieplan(linksPath);
  const therapieplanRechts = tryParseTherapieplan(rechtsPath);

  return {
    at,
    pNummer: String(kunde['P_Nummer'] ?? '').trim(),
    kundennummer: String(auftrag['Kundennummer'] ?? '').trim(),
    erstellt: String(auftrag['Erstellt'] ?? '').trim(),
    bezug: parseIniValue(werkstatt['Bezug']) || undefined,
    fraesmaterial: parseIniValue(werkstatt['Fraesmaterial']) || undefined,
    schuhgroesse: parseIniValue(werkstatt['Schuhgroesse']) || undefined,
    brandsohle: parseIniValue(werkstatt['Brandsohle']) || undefined,
    einlagentyp: parseIniValue(einlagentyp['Typ']) || undefined,
    bemerkungen,
    therapieplanLinks,
    therapieplanRechts,
  };
}

function resolveFieldMappings(
  order: PESInsolePlanData,
  productionMethod: string,
): FieldMappingResult {
  const topCoverMapped = mapTopCoverMaterial(order.bezug);
  const coreMaterialMapped = mapCoreMaterial(order.fraesmaterial);
  const groundSolePatternMapped = mapGroundSolePattern(order.brandsohle);
  const insoleTypeMapped = mapInsoleType(order.einlagentyp);
  const infillMapped = mapInfill(order.fraesmaterial);
  const resolvedInfill = resolveEnumValue(infillMapped, EInfill);

  const mappingResults: MappingResult[] = [
    { label: 'Afdekmateriaal', original: order.bezug, mapped: topCoverMapped },
    { label: 'Grondzoolpatroon', original: order.brandsohle, mapped: groundSolePatternMapped },
    { label: 'Zolentype', original: order.einlagentyp, mapped: insoleTypeMapped },
  ];

  if (productionMethod === EProductionMethod.Milling) {
    mappingResults.push({ label: 'Materiaal', original: order.fraesmaterial, mapped: coreMaterialMapped });
  }

  if (productionMethod === EProductionMethod.Printing) {
    mappingResults.push({ label: 'Infill', original: order.fraesmaterial, mapped: resolvedInfill });
  }

  const bottomFinish = productionMethod === EProductionMethod.Printing
    ? resolveEnumValue(groundSolePatternMapped, EBottomFinish, BOTTOM_FINISH_ALIASES)
    : '';

  if (productionMethod === EProductionMethod.Printing && groundSolePatternMapped && !bottomFinish) {
    mappingResults.push({ label: 'Bodemafwerking', original: groundSolePatternMapped, mapped: '' });
  }

  return { mappingResults, topCoverMapped, coreMaterialMapped, groundSolePatternMapped, insoleTypeMapped, resolvedInfill, bottomFinish };
}

function resolveWorkshop(productionMethod: string): { ref: string; name: string } {
  if (productionMethod === EProductionMethod.Milling) {
    return { ref: WORKSHOP_CONFIG.millingTenantRef, name: WORKSHOP_CONFIG.millingTenantName };
  }
  return { ref: WORKSHOP_CONFIG.printingTenantRef, name: WORKSHOP_CONFIG.printingTenantName };
}

function mapRotationValues(
  leftRotations: ParsedTherapieplan['rotations'],
  rightRotations: ParsedTherapieplan['rotations'],
): RotationValues {
  return {
    rearFootLateralLeft: String(leftRotations.pronationHindfoot),
    rearFootLateralRight: String(rightRotations.pronationHindfoot),
    rearFootMedialLeft: String(leftRotations.supinationHindfoot),
    rearFootMedialRight: String(rightRotations.supinationHindfoot),
    foreFootLateralLeft: String(leftRotations.pronationForefoot),
    foreFootLateralRight: String(rightRotations.pronationForefoot),
    foreFootMedialLeft: String(leftRotations.supinationForefoot),
    foreFootMedialRight: String(rightRotations.supinationForefoot),
  };
}

function addUnmappedElementNotes(unmapped: UnmappedElement[], mappingResults: MappingResult[]): void {
  for (const { name, heightLeft, heightRight } of unmapped) {
    const heights: string[] = [];
    if (heightLeft !== null) heights.push(`L:${heightLeft}`);
    if (heightRight !== null) heights.push(`R:${heightRight}`);
    const heightStr = heights.length > 0 ? ` (${heights.join(' ')})` : '';
    mappingResults.push({ label: 'Element', original: `${name}${heightStr}`, mapped: '' });
  }
}

export function mapOrderToInsolePlanRow(
  order: PESInsolePlanData & { therapieplanLinks: ParsedTherapieplan; therapieplanRechts: ParsedTherapieplan },
  patientId: string,
  tenantRef: string,
): InsolePlanCsvRow {
  const productionMethod = determineProductionMethod(order.bemerkungen);
  const fieldMappings = resolveFieldMappings(order, productionMethod);

  const { elements: combinedElements, unmapped } = combineElements(
    order.therapieplanLinks.elements,
    order.therapieplanRechts.elements,
    mapElements,
  );

  addUnmappedElementNotes(unmapped, fieldMappings.mappingResults);

  const productionNotes = assembleProductionNotes(order.bemerkungen, fieldMappings.mappingResults);
  const leftSettings = calculateGroundSoleSettings(order.therapieplanLinks.materialstaerke);
  const rightSettings = calculateGroundSoleSettings(order.therapieplanRechts.materialstaerke);
  const rotations = mapRotationValues(order.therapieplanLinks.rotations, order.therapieplanRechts.rotations);
  const workshop = resolveWorkshop(productionMethod);

  const values: Record<string, string> = {
    id: `insoleplan-${order.at}`,
    consult_id: `consult-${order.at}`,
    created_at: formatCreatedDate(order.erstellt),
    manager_tenant_ref: tenantRef,
    name: INSOLE_PLAN_NAME,
    patient_id: patientId,
    user_id: INSOLE_PLAN_USER_ID,
    workshop_tenant_ref: workshop.ref,
    elements: JSON.stringify(combinedElements),
    insole_type: fieldMappings.insoleTypeMapped,
    modelling_required: 'true',
    ground_sole_pattern: fieldMappings.groundSolePatternMapped,
    production_method: productionMethod,
    side: ESide.Both,
    size: order.schuhgroesse ?? '',
    size_system: determineSizeSystem(order.schuhgroesse),
    cad_model: '',
    production_notes: productionNotes,
    core_material: fieldMappings.coreMaterialMapped,
    finishing_by: EFinishingBy.Insolution,
    infill: fieldMappings.resolvedInfill,
    workshop: workshop.name,
    bottom_finish: fieldMappings.bottomFinish,
    top_cover_material: fieldMappings.topCoverMapped,
    ground_sole_thickness_left: String(leftSettings.groundSoleThickness),
    ground_sole_thickness_right: String(rightSettings.groundSoleThickness),
    heel_lift_left: String(leftSettings.heelLift),
    heel_lift_right: String(rightSettings.heelLift),
    hind_foot_left: String(leftSettings.hindFoot),
    hind_foot_right: String(rightSettings.hindFoot),
    middle_hind_foot_left: String(leftSettings.middleHindFoot),
    middle_hind_foot_right: String(rightSettings.middleHindFoot),
    sole_lateral_rotation_left: '0',
    sole_lateral_rotation_right: '0',
    sole_medial_rotation_left: '0',
    sole_medial_rotation_right: '0',
    rear_foot_lateral_rotation_left: rotations.rearFootLateralLeft,
    rear_foot_lateral_rotation_right: rotations.rearFootLateralRight,
    rear_foot_medial_rotation_left: rotations.rearFootMedialLeft,
    rear_foot_medial_rotation_right: rotations.rearFootMedialRight,
    fore_foot_lateral_rotation_left: rotations.foreFootLateralLeft,
    fore_foot_lateral_rotation_right: rotations.foreFootLateralRight,
    fore_foot_medial_rotation_left: rotations.foreFootMedialLeft,
    fore_foot_medial_rotation_right: rotations.foreFootMedialRight,
  };

  return { values, unmapped: unmapped.map(({ name }) => ({ name, count: 1 })) };
}

export function validateOrder(
  order: PESInsolePlanData,
  patientLookup: Map<string, string>,
  knownTenants: Set<string>,
  seenATs: Set<string>,
): OrderValidationResult {
  if (seenATs.has(order.at)) return { valid: false, reason: 'duplicate' };
  if (!knownTenants.has(order.kundennummer)) return { valid: false, reason: 'unknownTenant' };

  const patientId = 'podozorg-' + order.pNummer;
  const tenantRef = patientLookup.get(patientId);
  if (!tenantRef) return { valid: false, reason: 'patientNotFound' };
  if (!order.therapieplanLinks || !order.therapieplanRechts) return { valid: false, reason: 'missingTherapieplan' };

  return { valid: true, patientId, tenantRef };
}

export function filterValidOrders(
  orders: PESInsolePlanData[],
  patientLookup: Map<string, string>,
  knownTenants: Set<string>,
): FilterResult {
  const skipCounts: Record<SkipReason, number> = { duplicate: 0, unknownTenant: 0, patientNotFound: 0, missingTherapieplan: 0 };
  const seenATs = new Set<string>();
  const validOrders: ValidatedOrder[] = [];

  for (const order of orders) {
    const validation = validateOrder(order, patientLookup, knownTenants, seenATs);

    if (!validation.valid) {
      console.warn(`Skipping insole plan ${order.at}: ${validation.reason}`);
      skipCounts[validation.reason]++;
      continue;
    }

    seenATs.add(order.at);
    validOrders.push({
      order: order as ValidatedOrder['order'],
      patientId: validation.patientId,
      tenantRef: validation.tenantRef,
    });
  }

  return { validOrders, skipCounts };
}

export function mapOrdersToCsvRows(
  validOrders: ValidatedOrder[],
): { dataRows: string[]; unmappedElements: Map<string, number> } {
  const dataRows: string[] = [];
  const unmappedElements = new Map<string, number>();

  for (const { order, patientId, tenantRef } of validOrders) {
    const { values, unmapped } = mapOrderToInsolePlanRow(order, patientId, tenantRef);

    for (const { name } of unmapped) {
      unmappedElements.set(name, (unmappedElements.get(name) ?? 0) + 1);
    }

    dataRows.push(INSOLE_PLAN_CSV_HEADERS.map((h) => values[h] ?? '').join(';'));
  }

  return { dataRows, unmappedElements };
}

export function writeInsolePlansCsv(
  orders: PESInsolePlanData[],
  patientLookup: Map<string, string>,
  knownTenants: Set<string>,
): InsolePlanWriteResult {
  const { validOrders, skipCounts } = filterValidOrders(orders, patientLookup, knownTenants);
  const { dataRows, unmappedElements } = mapOrdersToCsvRows(validOrders);

  const csvData = [INSOLE_PLAN_CSV_HEADERS.join(';'), ...dataRows].join('\n');
  fs.mkdirSync(path.dirname(INSOLE_PLANS_OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(INSOLE_PLANS_OUTPUT_PATH, csvData, 'utf-8');

  return { created: dataRows.length, skipCounts, unmappedElements };
}
