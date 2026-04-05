export class MigrationStore {
  private tenantRefs = new Map<string, string>();

  setTenantRef(tenantId: string, tenantRef: string): void {
    this.tenantRefs.set(tenantId, tenantRef);
  }

  getTenantRef(tenantId: string): string | undefined {
    return this.tenantRefs.get(tenantId);
  }
}
