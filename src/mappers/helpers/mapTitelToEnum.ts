import { EPatientTitle } from "../../generated.ts";

export function mapTitelToEnum(titel: string | undefined): EPatientTitle | undefined {
  if (titel === undefined || titel === "") return undefined;

  switch (titel.trim().toLowerCase()) {
    case "dr":
    case "dr.":
      return EPatientTitle.Dr;
    case "prof":
    case "prof.":
      return EPatientTitle.Prof;
    default:
      return undefined;
  }
}
