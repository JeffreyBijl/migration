import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { stringify } from "csv-stringify/sync";
import { Writer } from "./writer.ts";

export class CsvWriter<T extends Record<string, unknown>> extends Writer<T> {
  write(data: T[]): void {
    if (data.length === 0) {
      this.logger.warn("No data to write");
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
    this.logger.info(`CSV written: ${this.outputPath} (${data.length} rows)`);
  }
}
