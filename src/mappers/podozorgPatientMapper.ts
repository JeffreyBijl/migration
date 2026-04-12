import { EPatientStatus } from "../generated.ts";
import type { InsolutionPatient } from "../types/insolutionPatient.ts";
import type { PodozorgAuftrag } from "../types/podozorgAuftrag.ts";
import { formatGermanDate } from "./helpers/formatGermanDate.ts";
import { mapAnredeToGender } from "./helpers/mapAnredeToGender.ts";
import { mapTitelToEnum } from "./helpers/mapTitelToEnum.ts";
import type { Mapper } from "./mapper.ts";
import { PodozorgTenantRefResolver } from "../resolvers/podozorgTenantRefResolver.ts";

export class PodozorgPatientMapper implements Mapper<PodozorgAuftrag, InsolutionPatient> {
  constructor(private readonly tenantRefResolver: PodozorgTenantRefResolver) {}

  public map(auftrags: PodozorgAuftrag[]): InsolutionPatient[] {
    return auftrags.map((auftrag) => this.mapOne(auftrag));
  }

  private mapOne(auftrag: PodozorgAuftrag): InsolutionPatient {
    return {
      id: `podozorg-${auftrag.Kunde.P_Nummer.trim()}`,
      tenant_id: auftrag.Auftrag.Kundennummer.trim(),
      tenant_ref: this.tenantRefResolver.resolve(auftrag.Auftrag.Kundennummer.trim()),
      patient_number: auftrag.Kunde.P_Nummer.trim(),
      external_id: auftrag.Kunde.P_Nummer.trim(),
      first_name: auftrag.Kunde.P_Vorname?.trim() ?? null,
      last_name: auftrag.Kunde.P_Name.trim(),
      salutation: auftrag.Kunde.ANREDE?.trim() ?? null,
      title: mapTitelToEnum(auftrag.Kunde.TITEL),
      gender: mapAnredeToGender(auftrag.Kunde.ANREDE),
      street: auftrag.Kunde.STRASSE?.trim() ?? null,
      house_number: auftrag.Kunde.HAUSNUMMER?.trim() ?? null,
      postal_code: auftrag.Kunde.PLZ?.trim() ?? null,
      city: auftrag.Kunde.ORT?.trim() ?? null,
      phone: auftrag.Kunde.TELEFON?.trim() ?? null,
      mobile: auftrag.Kunde.MOBIL?.trim() ?? null,
      email: auftrag.Kunde.MAIL?.trim() ?? null,
      date_of_birth: formatGermanDate(auftrag.Kunde.P_Geb.trim()),
      status: EPatientStatus.Active,
      notes: auftrag.Kunde.INFO?.trim() ?? null,
    };
  }
}
