import type { PodozorgTenant } from "../types/podozorgTenant.ts";

export interface ResolvedTenant {
  id: string;
  name: string;
  ref: string;
}

export class PodozorgTenantRefResolver {
  constructor(private readonly tenants: PodozorgTenant[]) {}

  public resolve(tenantId: string): string {
    const currentTenant = this.tenants.find(
      (tenant) => String(tenant.tenantObseleteID) === tenantId,
    );
    if (!currentTenant) return "root." + tenantId + ".";
    return this.resolve(currentTenant.parentTenantObseleteID) + tenantId + ".";
  }

  public resolveTenant(tenantId: string): ResolvedTenant {
    const currentTenant = this.tenants.find(
      (tenant) => String(tenant.tenantObseleteID) === tenantId,
    );
    return {
      id: tenantId,
      name: currentTenant?.tenantName ?? "",
      ref: this.resolve(tenantId),
    };
  }
}
