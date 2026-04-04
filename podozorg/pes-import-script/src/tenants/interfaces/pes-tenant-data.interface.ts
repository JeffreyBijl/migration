export interface PESTenantData {
  tenantObseleteID: number;
  tenantName: string;
  tenantCity?: string;
  tenantCountry?: string;
  tenantEmail?: string;
  tenantHouseNo?: string | number;
  parentTenantObseleteID?: number;
  tenantPostalCode?: string;
  tenantStreetName?: string;
  tenantPhone?: string | number;
  workshopPrintingTenantId?: string;
  workshopPrintingTenantRef?: string;
  workshopPrintingTenantName?: string;
  workshopMillingTenantId?: string;
  workshopMillingTenantRef?: string;
  workshopMillingTenantName?: string;
}
