import type { AuftragIni } from "../models/auftrag-ini.interface.ts";
import type { CreatePatientInput } from "../models/generated.ts";
import {
  EPatientGender,
  EPatientStatus,
  EPatientTitle,
} from "../models/generated.ts";
import { Transformer } from "./transformer.ts";

export class PatientTransformer extends Transformer<AuftragIni, CreatePatientInput> {
  transform(input: AuftragIni): CreatePatientInput {
    const kunde = input.Kunde;
    const auftrag = input.Auftrag;

    this.logger.info(`Transforming patient: ${kunde.P_Nummer}`);

    return {
      id: `podozorg-${kunde.P_Nummer.trim()}`,
      tenant_id: auftrag.Kundennummer.trim(),
      tenant_ref: "",
      external_id: kunde.P_Nummer.trim(),
      first_name: kunde.P_Vorname.trim(),
      last_name: kunde.P_Name.trim(),
      salutation: kunde.ANREDE.trim(),
      title: this.mapStringToTitle(kunde.TITEL || kunde.ANREDE),
      gender: this.mapTitleToGender(kunde.TITEL || kunde.ANREDE),
      date_of_birth: this.formatDate(kunde.P_Geb),
      street: kunde.STRASSE.trim(),
      house_number: kunde.HAUSNUMMER.trim(),
      postal_code: kunde.PLZ.trim(),
      city: kunde.ORT.trim(),
      phone: kunde.TELEFON.trim(),
      mobile: kunde.MOBIL.trim(),
      email: kunde.MAIL.trim(),
      notes: kunde.INFO.trim(),
      status: EPatientStatus.Active,
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
