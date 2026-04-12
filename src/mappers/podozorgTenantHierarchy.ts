import type { PodozorgTenant } from "../types/podozorgTenant.ts";

export class PodozorgTenantHierarchy {
  constructor(private readonly tenants: PodozorgTenant[]) {}

  public resolveRef(tenantId: string): string {
    const currentTenant = this.tenants.find(
      (tenant) => String(tenant.tenantObseleteID) === tenantId,
    );
    if (!currentTenant) return "root." + tenantId + ".";
    return this.resolveRef(currentTenant.parentTenantObseleteID) + tenantId + ".";
  }
}
