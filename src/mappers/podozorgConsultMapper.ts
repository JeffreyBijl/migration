import { EConsultStatus } from "../generated.ts";
import { PodozorgTenantRefResolver } from "../resolvers/podozorgTenantRefResolver.ts";
import type { InsolutionConsult } from "../types/insolutionConsult.ts";
import type { PodozorgAuftrag } from "../types/podozorgAuftrag.ts";
import { mapDiagnoseToProfileBDiagnosis } from "./helpers/mapDiagnoseToProfileBDiagnosis.ts";
import { mapFusstypToFootType } from "./helpers/mapFusstypToFootType.ts";
import { parseErstelltToIsoString } from "./helpers/parseErstelltToIsoString.ts";
import type { Mapper } from "./mapper.ts";

const MIGRATION_USER_ID = "migration@insolution.nl";

export class PodozorgConsultMapper implements Mapper<PodozorgAuftrag, InsolutionConsult> {
  constructor(private readonly tenantRefResolver: PodozorgTenantRefResolver) {}

  public map(auftrags: PodozorgAuftrag[]): InsolutionConsult[] {
    return auftrags.map((auftrag) => this.mapOne(auftrag));
  }

  // TODO: samengesteld veld tenant_ref#date#id (sortkey) nog toevoegen,
  //       analoog aan patient_search op PodozorgPatientMapper.
  // TODO: scan_2d_templates / scan_pp_templates zodra scans-pipeline bestaat.
  private mapOne(auftrag: PodozorgAuftrag): InsolutionConsult {
    const tenantId = auftrag.Auftrag.Kundennummer.trim();
    const auftragNumber = auftrag.Auftrag.AT!.trim();
    const erstellt = auftrag.Auftrag.Erstellt!;

    return {
      id: `consult-${auftragNumber}`,
      patient_id: `podozorg-${auftrag.Kunde.P_Nummer.trim()}`,
      status: EConsultStatus.OrderCreated,
      date: parseErstelltToIsoString(erstellt),
      tenant_ref: this.tenantRefResolver.resolve(tenantId),
      user_id: MIGRATION_USER_ID,
      profile_b_diagnosis: mapDiagnoseToProfileBDiagnosis(auftrag.Diagnose?.Diagnose),
      profile_b_foot_type_left: mapFusstypToFootType(auftrag.Fusstyp?.Typ),
      profile_b_foot_type_right: mapFusstypToFootType(auftrag.Fusstyp?.Typ),
      enable_reminder: false,
    };
  }
}
