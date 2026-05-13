import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { stringify } from "csv-stringify/sync";
import { IniDataSource } from "../../src/sources/iniDataSource.ts";

type ParsedIni = Record<string, Record<string, string>>;

interface ValueMappingRow {
  source_value: string;
  count: number;
  target_value: string;
}

const INI_DIRECTORY = "podozorg/data/ini";
const VALUE_MAPPINGS_DIRECTORY = "podozorg/mapping/value-mappings";

function readExistingTargets(filePath: string): Map<string, string> {
  const existing = new Map<string, string>();
  if (!existsSync(filePath)) return existing;
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === "") continue;
    const [sourceValue, , targetValue] = line.split(";");
    if (sourceValue !== undefined && targetValue !== undefined) {
      existing.set(sourceValue, targetValue);
    }
  }
  return existing;
}

function scanFiles(section: string, field: string): { counts: Map<string, number>; missing: number; total: number } {
  const counts = new Map<string, number>();
  let missing = 0;
  const fileNames = readdirSync(INI_DIRECTORY)
    .filter((fileName) => fileName.endsWith("_Auftrag.ini"))
    .sort();

  for (const fileName of fileNames) {
    const parsed = new IniDataSource<ParsedIni>(join(INI_DIRECTORY, fileName)).read();
    const rawValue = parsed[section]?.[field];
    if (rawValue === undefined) {
      missing += 1;
      continue;
    }
    const value = rawValue.trim();
    if (value === "") {
      missing += 1;
      continue;
    }
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return { counts, missing, total: fileNames.length };
}

function buildRows(counts: Map<string, number>, existingTargets: Map<string, string>): ValueMappingRow[] {
  const rows: ValueMappingRow[] = [];
  for (const [sourceValue, count] of counts) {
    rows.push({
      source_value: sourceValue,
      count,
      target_value: existingTargets.get(sourceValue) ?? "",
    });
  }
  for (const [sourceValue, targetValue] of existingTargets) {
    if (counts.has(sourceValue)) continue;
    if (targetValue === "") continue;
    rows.push({
      source_value: sourceValue,
      count: 0,
      target_value: targetValue,
    });
  }
  rows.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.source_value.localeCompare(b.source_value);
  });
  return rows;
}

export function scanFieldValues(section: string, field: string): void {
  const { counts, missing, total } = scanFiles(section, field);
  const outputFileName = `${section.toLowerCase()}_${field.toLowerCase()}.csv`;
  const outputPath = join(VALUE_MAPPINGS_DIRECTORY, outputFileName);
  const existingTargets = readExistingTargets(outputPath);
  const rows = buildRows(counts, existingTargets);

  const csv = stringify(rows, {
    header: true,
    columns: ["source_value", "count", "target_value"],
    delimiter: ";",
  });

  mkdirSync(VALUE_MAPPINGS_DIRECTORY, { recursive: true });
  writeFileSync(outputPath, csv);

  process.stdout.write(
    `Scanned ${total} files, found ${counts.size} unique values (${missing} missing/empty), wrote ${outputPath}\n`,
  );
}
