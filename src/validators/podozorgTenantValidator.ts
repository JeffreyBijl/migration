import type { PodozorgTenant } from "../models/podozorgTenant.ts";
import type { Validator } from "./validator.ts";

export class PodozorgTenantValidator implements Validator<PodozorgTenant> {
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

  validate(item: PodozorgTenant): boolean {
    for (const field of this.requiredFields) {
      const value = item[field];
      if (value === undefined || value === null || value === "") {
        console.log(`Tenant "${item.tenantName}": missing or empty field "${field}"`);
        return false;
      }
    }

    return true;
  }
}
