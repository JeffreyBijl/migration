export interface TenantJson {
  tenantObseleteID: number;
  tenantName: string;
  tenantCity: string;
  tenantCountry: string;
  tenantPostalCode: string;
  tenantStreetName: string;
  tenantHouseNo: string | number;
  tenantPhone?: string;
  tenantMobile?: string;
  tenantEmail: string;
  parentTenantObseleteID: string;
  workshopPrintingTenantId: string;
  workshopPrintingTenantRef: string;
  workshopPrintingTenantName: string;
  workshopMillingTenantId: string;
  workshopMillingTenantRef: string;
  workshopMillingTenantName: string;
}
