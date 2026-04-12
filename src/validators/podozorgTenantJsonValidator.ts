import type { PodozorgTenant } from "../types/podozorgTenant.ts";
import type { ValidationResult, Validator } from "./validator.ts";

// TODO: nadenken of we op genoeg zaken valideren — nu alleen presence van required fields
export class PodozorgTenantJsonValidator implements Validator<PodozorgTenant> {
  private readonly requiredFields: (keyof PodozorgTenant)[] = [
    "tenantObseleteID",
    "tenantName",
    "parentTenantObseleteID",
    "workshopPrintingTenantId",
    "workshopPrintingTenantRef",
    "workshopPrintingTenantName",
    "workshopMillingTenantId",
    "workshopMillingTenantRef",
    "workshopMillingTenantName",
  ];

  public validate(item: PodozorgTenant): ValidationResult {
    for (const field of this.requiredFields) {
      const value = item[field];
      if (value === undefined || value === null || value === "") {
        return {
          isValid: false,
          reason: `Tenant "${item.tenantName}": missing or empty field "${field}"`,
        };
      }
    }

    return { isValid: true, reason: "" };
  }
}
