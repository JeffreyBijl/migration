import type { AuftragIni } from "../models/auftrag-ini.interface.ts";
import { IniValidator } from "./ini-validator.ts";

export class AuftragValidator extends IniValidator<AuftragIni> {
  protected readonly requiredFields: Record<string, string[]> = {
    Auftrag: ["Erstellt", "Art", "AT", "Kundennummer", "Status", "Versendet"],
    Versand: ["Versandadresse", "Versandart", "Anzahl"],
    Kunde: [
      "P_Name",
      "P_Vorname",
      "P_Geb",
      "P_Nummer",
      "ANREDE",
      "STRASSE",
      "HAUSNUMMER",
      "PLZ",
      "ORT",
      "LAND",
      "MAIL",
    ],
    Versandadresse: ["Strasse", "Hausnummer", "Land", "PLZ", "Ort", "NAME"],
    Einlagentyp: ["Typ"],
    Diagnose: ["Diagnose"],
    Fusstyp: ["Typ"],
    Werkstatt: [
      "Bezug",
      "Fraesmaterial",
      "Brandsohle",
      "Schuhgroesse",
      "Einlagenlaenge",
    ],
  };
}
