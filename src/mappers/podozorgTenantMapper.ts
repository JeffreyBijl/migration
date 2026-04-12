import { ETenantProfile } from "../generated.ts";
import type { InsolutionTenant } from "../types/insolutionTenant.ts";
import type { PodozorgTenant } from "../types/podozorgTenant.ts";
import { PodozorgTenantRefResolver } from "../resolvers/podozorgTenantRefResolver.ts";
import type { Mapper } from "./mapper.ts";

export class PodozorgTenantMapper implements Mapper<
  PodozorgTenant,
  InsolutionTenant
> {
  constructor(private readonly tenantRefResolver: PodozorgTenantRefResolver) {}

  public map(tenants: PodozorgTenant[]): InsolutionTenant[] {
    return tenants.map((tenant) => ({
      id: String(tenant.tenantObseleteID),
      name: tenant.tenantName,
      city: tenant.tenantCity,
      country: tenant.tenantCountry,
      street: tenant.tenantStreetName,
      house_number:
        tenant.tenantHouseNo != null ? String(tenant.tenantHouseNo) : "",
      postal_code: tenant.tenantPostalCode,
      email: tenant.tenantEmail,
      phone: tenant.tenantPhone ?? tenant.tenantMobile ?? null,
      parent_id: tenant.parentTenantObseleteID,
      tenant_ref: this.tenantRefResolver.resolve(String(tenant.tenantObseleteID)),
      profile: ETenantProfile.B,
      insole_element_libraries: ["TREATMENT_ELEMENTS"],
      workshop_milling_tenant_id: tenant.workshopMillingTenantId,
      workshop_milling_tenant_name: tenant.workshopMillingTenantName,
      workshop_milling_tenant_ref: tenant.workshopMillingTenantRef,
      workshop_printing_tenant_id: tenant.workshopPrintingTenantId,
      workshop_printing_tenant_name: tenant.workshopPrintingTenantName,
      workshop_printing_tenant_ref: tenant.workshopPrintingTenantRef,
    }));
  }
}
