import type { Tenant } from "../models/generated.ts";
import { ETenantProfile } from "../models/generated.ts";
import type { TenantJson } from "../models/tenant-json.interface.ts";
import { Transformer } from "./transformer.ts";

export class TenantTransformer extends Transformer<TenantJson[], Tenant[]> {
  transform(input: TenantJson[]): Tenant[] {
    const lookup = new Map<string, TenantJson>();
    for (const tenant of input) {
      lookup.set(String(tenant.tenantObseleteID), tenant);
    }

    return input.map((tenant) => {
      this.logger.info(`Transforming tenant: ${tenant.tenantName}`);

      return {
        id: String(tenant.tenantObseleteID),
        name: tenant.tenantName,
        city: tenant.tenantCity,
        country: tenant.tenantCountry,
        street: tenant.tenantStreetName,
        house_number: tenant.tenantHouseNo != null ? String(tenant.tenantHouseNo) : "",
        postal_code: tenant.tenantPostalCode,
        email: tenant.tenantEmail,
        phone: tenant.tenantPhone ?? tenant.tenantMobile ?? null,
        parent_id: tenant.parentTenantObseleteID,
        tenant_ref:
          "root." +
          this.buildTenantRef(String(tenant.tenantObseleteID), lookup) +
          ".",
        profile: ETenantProfile.B,
        insole_element_libraries: ["TREATMENT_ELEMENTS"],
        workshop_milling_tenant_id: tenant.workshopMillingTenantId,
        workshop_milling_tenant_name: tenant.workshopMillingTenantName,
        workshop_milling_tenant_ref: tenant.workshopMillingTenantRef,
        workshop_printing_tenant_id: tenant.workshopPrintingTenantId,
        workshop_printing_tenant_name: tenant.workshopPrintingTenantName,
        workshop_printing_tenant_ref: tenant.workshopPrintingTenantRef,
      };
    });
  }

  private buildTenantRef(
    tenantId: string,
    lookup: Map<string, TenantJson>,
  ): string {
    const parent = lookup.get(tenantId);
    if (!parent) return tenantId;
    return this.buildTenantRef(parent.parentTenantObseleteID, lookup) + "." + tenantId;
  }
}
