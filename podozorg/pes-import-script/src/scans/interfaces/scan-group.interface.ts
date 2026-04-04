export interface ScanGroup {
  base: string;
  at: string;
  kundennummer: string;
  files: string[];
}

export interface ScanStats {
  created: number;
  skippedNoTenant: number;
  skippedNoAuftrag: number;
  unknownTenantCounts: Map<string, number>;
  unknownAuftragATs: string[];
}

export interface ValidatedScanGroup {
  group: ScanGroup;
  tenantRef: string;
  pNummer: string;
}
