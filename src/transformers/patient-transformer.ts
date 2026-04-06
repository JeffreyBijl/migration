import type { MigrationStore } from "../core/migration-store.ts";
import type { AuftragIni } from "../models/auftrag-ini.interface.ts";
import {
  EPatientGender,
  EPatientStatus,
  EPatientTitle,
} from "../models/generated.ts";
import type { MigrationPatient } from "../models/patient-migration.ts";
import type { Logger } from "../core/logger.ts";
import { Transformer } from "./transformer.ts";

export class PatientTransformer extends Transformer<
  AuftragIni,
  MigrationPatient
> {
  constructor(
    logger: Logger,
    private readonly migrationStore: MigrationStore,
  ) {
    super(logger);
  }

  transform(input: AuftragIni): MigrationPatient | null {
    const kunde = input.Kunde;
    const auftrag = input.Auftrag;
    const tenantId = auftrag.Kundennummer.trim();

    this.logger.info(`Transforming patient: ${kunde.P_Nummer}`);

    const tenantRef = this.migrationStore.getTenantRef(tenantId);
    if (!tenantRef) {
      this.logger.error(`No tenant_ref found for Kundennummer ${tenantId}, skipping`);
      return null;
    }

    const id = `podozorg-${kunde.P_Nummer.trim()}`;
    const externalId = kunde.P_Nummer.trim();
    const lastName = kunde.P_Name.trim();
    const houseNumber = kunde.HAUSNUMMER.trim();
    const postalCode = kunde.PLZ.trim();
    const phone = kunde.TELEFON.trim();
    const mobile = kunde.MOBIL.trim();
    const email = kunde.MAIL.trim();
    const dateOfBirth = this.formatDate(kunde.P_Geb);

    const searchTerms = [
      id,
      externalId,
      lastName,
      houseNumber,
      postalCode,
      phone,
      mobile,
      email,
      dateOfBirth,
    ]
      .filter(Boolean)
      .join(", ")
      .toLowerCase();

    return {
      id,
      tenant_id: tenantId,
      tenant_ref: tenantRef ?? "",
      external_id: externalId,
      first_name: kunde.P_Vorname.trim(),
      last_name: lastName,
      salutation: kunde.ANREDE.trim(),
      title: this.mapStringToTitle(kunde.TITEL || kunde.ANREDE),
      gender: this.mapTitleToGender(kunde.TITEL || kunde.ANREDE),
      date_of_birth: dateOfBirth,
      street: kunde.STRASSE.trim(),
      house_number: houseNumber,
      postal_code: postalCode,
      city: kunde.ORT.trim(),
      phone,
      mobile,
      email,
      notes: kunde.INFO.trim(),
      status: EPatientStatus.Active,
      search_terms: searchTerms,
      patient_number: this.migrationStore.getPatientNumber(id, tenantId),
    };
  }

  private formatDate(date: string): string {
    const [day, month, year] = date.trim().split(".");
    return `${year}-${month}-${day}`;
  }

  private mapStringToTitle(titel: string): EPatientTitle {
    const mapping: Record<string, EPatientTitle> = {
      Hr: EPatientTitle.Mr,
      Mw: EPatientTitle.Mrs,
      Dr: EPatientTitle.Dr,
      Prof: EPatientTitle.Prof,
    };
    return mapping[titel.trim()] ?? EPatientTitle.Other;
  }

  private mapTitleToGender(titel: string): EPatientGender {
    const mapping: Record<string, EPatientGender> = {
      Hr: EPatientGender.Male,
      Mw: EPatientGender.Female,
    };
    return mapping[titel.trim()] ?? EPatientGender.Unknown;
  }
}
