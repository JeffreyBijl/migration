import type { TenantJson } from "../models/tenant-json.interface.ts";
import { Validator } from "./validator.ts";

export class TenantValidator extends Validator<TenantJson[]> {
  private readonly requiredFields: (keyof TenantJson)[] = [
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

  private readonly optionalFields: (keyof TenantJson)[] = [
    "tenantCity",
    "tenantStreetName",
    "tenantHouseNo",
    "tenantPostalCode",
    "tenantCountry",
    "tenantEmail",
  ];

  validate(): string[] {
    const errors: string[] = [];

    for (const tenant of this.data) {
      const name = tenant.tenantName ?? `ID ${tenant.tenantObseleteID}`;

      for (const field of this.requiredFields) {
        const value = tenant[field];
        if (value === undefined || value === null || value === "") {
          const message = `Tenant "${name}": missing or empty field "${field}"`;
          this.logger.error(message);
          errors.push(message);
        }
      }

      for (const field of this.optionalFields) {
        const value = tenant[field];
        if (value === undefined || value === null || value === "") {
          this.logger.warn(`Tenant "${name}": missing or empty field "${field}"`);
        }
      }
    }

    if (errors.length === 0) {
      this.logger.info(`Tenant validation passed for ${this.data.length} tenants`);
    }

    return errors;
  }
}
