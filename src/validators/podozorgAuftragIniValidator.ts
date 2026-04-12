import type { PodozorgAuftrag } from "../types/podozorgAuftrag.ts";
import type { ValidationResult, Validator } from "./validator.ts";

type RequiredPatientField =
  | { section: "Auftrag"; field: keyof PodozorgAuftrag["Auftrag"] }
  | { section: "Kunde"; field: keyof PodozorgAuftrag["Kunde"] };

// TODO: nadenken of we op genoeg zaken valideren — nu alleen presence van patient-velden
export class PodozorgAuftragIniValidator implements Validator<PodozorgAuftrag> {
  private readonly requiredPatientFields: ReadonlyArray<RequiredPatientField> = [
    { section: "Auftrag", field: "Kundennummer" },
    { section: "Kunde", field: "P_Nummer" },
    { section: "Kunde", field: "P_Name" },
    { section: "Kunde", field: "P_Geb" },
  ];

  public validate(item: PodozorgAuftrag): ValidationResult {
    for (const { section, field } of this.requiredPatientFields) {
      const value = item[section]?.[field as keyof PodozorgAuftrag[typeof section]];
      if (value === undefined || value === null || value === "") {
        return {
          isValid: false,
          reason: `Auftrag "${item.Auftrag?.AT ?? "?"}": missing or empty field "[${section}].${field}"`,
        };
      }
    }

    return { isValid: true, reason: "" };
  }
}
