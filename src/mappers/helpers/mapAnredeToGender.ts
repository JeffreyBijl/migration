import { EPatientGender } from "../../generated.ts";

export function mapAnredeToGender(anrede: string | undefined): EPatientGender | undefined {
  if (anrede === undefined || anrede === "") return undefined;

  switch (anrede.trim().toLowerCase()) {
    case "dhr":
    case "dhr.":
    case "heer":
      return EPatientGender.Male;
    case "mw":
    case "mw.":
    case "mevr":
    case "mevr.":
    case "mevrouw":
      return EPatientGender.Female;
    default:
      return undefined;
  }
}
