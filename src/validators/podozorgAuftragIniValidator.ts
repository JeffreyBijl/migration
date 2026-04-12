import type { PodozorgAuftrag } from "../types/podozorgAuftrag.ts";
import type { ValidationResult, Validator } from "./validator.ts";

type RequiredField =
  | { section: "Auftrag"; field: keyof PodozorgAuftrag["Auftrag"] }
  | { section: "Kunde"; field: keyof PodozorgAuftrag["Kunde"] };

export class PodozorgAuftragIniValidator implements Validator<PodozorgAuftrag> {
  private readonly requiredFields: ReadonlyArray<RequiredField> = [
    { section: "Auftrag", field: "Kundennummer" },
    { section: "Auftrag", field: "AT" },
    { section: "Auftrag", field: "Erstellt" },
    { section: "Kunde", field: "P_Nummer" },
    { section: "Kunde", field: "P_Name" },
    { section: "Kunde", field: "P_Geb" },
  ];

  public validate(item: PodozorgAuftrag): ValidationResult {
    for (const { section, field } of this.requiredFields) {
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
