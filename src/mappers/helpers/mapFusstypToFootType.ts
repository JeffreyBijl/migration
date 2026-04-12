import { EFootType } from "../../generated.ts";

export function mapFusstypToFootType(fusstyp: string | undefined): EFootType | null {
  if (fusstyp === undefined || fusstyp === "") return null;

  switch (fusstyp.trim().toLowerCase()) {
    case "normalfuss":
    case "normalvoet":
      return EFootType.Rectus;
    case "hohlfuss":
    case "holvoet":
      return EFootType.Cavus;
    case "senkfuss":
    case "plattfuss":
    case "platvoet":
      return EFootType.Planus;
    default:
      return null;
  }
}
