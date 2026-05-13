import { scanFieldValues } from "./valueMappingScanner.ts";

const FIELDS_TO_SCAN: Array<{ section: string; field: string }> = [
  { section: "Auftrag", field: "Art" },
  { section: "Diagnose", field: "Diagnose" },
  { section: "Einlagentyp", field: "Typ" },
  { section: "Fusstyp", field: "Typ" },
  { section: "Werkstatt", field: "Bezug" },
  { section: "Werkstatt", field: "Brandsohle" },
  { section: "Werkstatt", field: "Einlagenlaenge" },
  { section: "Werkstatt", field: "Fraesmaterial" },
  { section: "Werkstatt", field: "Schuhgroesse" },
];

for (const { section, field } of FIELDS_TO_SCAN) {
  scanFieldValues(section, field);
}
