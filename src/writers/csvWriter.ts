import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { stringify } from "csv-stringify/sync";
import type { Writer } from "./writer.ts";

export class CsvWriter<T extends Record<string, unknown>> implements Writer<T> {
  constructor(private readonly outputPath: string) {}

  write(data: T[]): void {
    if (data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0]);
    const output = stringify(data, {
      header: true,
      columns: headers,
      delimiter: ";",
    });

    mkdirSync(dirname(this.outputPath), { recursive: true });
    writeFileSync(this.outputPath, output);
  }
}
