import { EOrderStatus, EProductionMethod } from "../generated.ts";
import { PodozorgTenantRefResolver } from "../resolvers/podozorgTenantRefResolver.ts";
import type { InsolutionOrder } from "../types/insolutionOrder.ts";
import type { PodozorgAuftrag } from "../types/podozorgAuftrag.ts";
import { mapVersandadresseNameToShippingTarget } from "./helpers/mapVersandadresseNameToShippingTarget.ts";
import { mapVersandartToIsUrgent } from "./helpers/mapVersandartToIsUrgent.ts";
import { parseErstelltToIsoString } from "./helpers/parseErstelltToIsoString.ts";
import type { Mapper } from "./mapper.ts";

export class PodozorgOrderMapper implements Mapper<
  PodozorgAuftrag,
  InsolutionOrder
> {
  constructor(private readonly tenantRefResolver: PodozorgTenantRefResolver) {}

  public map(auftrags: PodozorgAuftrag[]): InsolutionOrder[] {
    return auftrags.map((auftrag) => this.mapOne(auftrag));
  }

  // TODO: order_number moet uiteindelijk `{Kundennummer}-{counter}` worden
  //       met een per-Kundennummer counter; voor nu gelijk aan AT.
  // TODO: production_method, insole_plan_id en workshop_tenant_* zodra de
  //       insole_plans pipeline bestaat.
  // TODO: scan_2d_templates zodra de scans pipeline bestaat.
  // TODO: manager tenant id and name are proberly const values have to loop up
  private mapOne(auftrag: PodozorgAuftrag): InsolutionOrder {
    const auftragNumber = auftrag.Auftrag.AT!.trim();
    const kundennummer = auftrag.Auftrag.Kundennummer.trim();
    const erstellt = auftrag.Auftrag.Erstellt!;
    const createdAt = parseErstelltToIsoString(erstellt);
    const tenant = this.tenantRefResolver.resolveTenant(kundennummer);
    const orderNumber = auftragNumber;

    return {
      id: `order-${auftragNumber}`,
      order_number: orderNumber,
      external_order_number: auftragNumber,
      manager_user_id: "migration-user",
      status: EOrderStatus.Shipped,
      material: "",
      production_method: EProductionMethod.Milling,
      created_at: createdAt,
      confirmed_at: createdAt,
      attachments: [],
      manager_tenant_id: tenant.id,
      manager_tenant_name: tenant.name,
      manager_tenant_ref: tenant.ref,
      workshop_tenant_id: "TODO-workshop-tenant-id",
      workshop_tenant_ref: "TODO-workshop-tenant-ref",
      version_number: 1,
      consult_id: `consult-${auftragNumber}`,
      patient_id: `podozorg-${auftrag.Kunde.P_Nummer.trim()}`,
      insole_plan_id: `TODO-insoleplan-${auftragNumber}`,
      shipping_target: mapVersandadresseNameToShippingTarget(
        auftrag.Versandadresse?.NAME,
        tenant.name,
      ),
      is_urgent: mapVersandartToIsUrgent(auftrag.Versand?.Versandart),
      rework_reason: "",
      scan_2d_templates: [],
      scan_3d_templates: [],
      scan_pp_templates: [],
      search_terms: [orderNumber, "migration-user"].join(", "),
    };
  }
}
