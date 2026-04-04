export interface PESInsolePlanData {
  at: string;
  pNummer: string;
  kundennummer: string;
  erstellt: string;
  bezug?: string;
  fraesmaterial?: string;
  schuhgroesse?: string;
  brandsohle?: string;
  einlagentyp?: string;
  bemerkungen: string[];
  therapieplanLinks: ParsedTherapieplan | null;
  therapieplanRechts: ParsedTherapieplan | null;
}

export interface ParsedTherapieplan {
  elements: TherapieplanElement[];
  materialstaerke: Materialstaerke;
  rotations: TherapieplanRotations;
}

export interface Materialstaerke {
  zehen: number;
  ballen: number;
  ferse: number;
}

export interface TherapieplanRotations {
  supinationHindfoot: number;
  supinationForefoot: number;
  pronationHindfoot: number;
  pronationForefoot: number;
}

export interface TherapieplanElement {
  name: string;
  height: number;
}

export interface GroundSoleSettings {
  groundSoleThickness: number;
  heelLift: number;
  hindFoot: number;
  middleHindFoot: number;
}

export interface CombinedElement {
  id: string;
  left: boolean;
  right: boolean;
  height_left: number | null;
  height_right: number | null;
  infill_left: string | null;
  infill_right: string | null;
}

export interface MappingResult {
  label: string;
  original: string | undefined;
  mapped: string;
}

export interface UnmappedElement {
  name: string;
  heightLeft: number | null;
  heightRight: number | null;
}

export interface CombineElementsResult {
  elements: CombinedElement[];
  unmapped: UnmappedElement[];
}

export interface FieldMappingResult {
  mappingResults: MappingResult[];
  topCoverMapped: string;
  coreMaterialMapped: string;
  groundSolePatternMapped: string;
  insoleTypeMapped: string;
  resolvedInfill: string;
  bottomFinish: string;
}

export interface RotationValues {
  rearFootLateralLeft: string;
  rearFootLateralRight: string;
  rearFootMedialLeft: string;
  rearFootMedialRight: string;
  foreFootLateralLeft: string;
  foreFootLateralRight: string;
  foreFootMedialLeft: string;
  foreFootMedialRight: string;
}

export type SkipReason = 'duplicate' | 'unknownTenant' | 'patientNotFound' | 'missingTherapieplan';

export type OrderValidationResult = {
  valid: true;
  patientId: string;
  tenantRef: string;
} | {
  valid: false;
  reason: SkipReason;
}

export interface ValidatedOrder {
  order: PESInsolePlanData & { therapieplanLinks: ParsedTherapieplan; therapieplanRechts: ParsedTherapieplan };
  patientId: string;
  tenantRef: string;
}

export interface InsolePlanCsvRow {
  values: Record<string, string>;
  unmapped: { name: string; count: number }[];
}

export interface FilterResult {
  validOrders: ValidatedOrder[];
  skipCounts: Record<SkipReason, number>;
}

export interface InsolePlanWriteResult {
  created: number;
  skipCounts: Record<SkipReason, number>;
  unmappedElements: Map<string, number>;
}
