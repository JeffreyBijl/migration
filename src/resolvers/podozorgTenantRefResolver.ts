import type { PodozorgTenant } from "../types/podozorgTenant.ts";

export class PodozorgTenantRefResolver {
  constructor(private readonly tenants: PodozorgTenant[]) {}

  public resolve(tenantId: string): string {
    const currentTenant = this.tenants.find(
      (tenant) => String(tenant.tenantObseleteID) === tenantId,
    );
    if (!currentTenant) return "root." + tenantId + ".";
    return this.resolve(currentTenant.parentTenantObseleteID) + tenantId + ".";
  }
}
