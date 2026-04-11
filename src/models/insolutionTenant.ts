import type { Tenant } from "../generated.ts";

export type InsolutionTenant = Omit<Tenant, "__typename">;
