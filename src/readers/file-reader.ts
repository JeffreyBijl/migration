import { existsSync, readFileSync } from "fs";
import type { Logger } from "../core/logger.ts";

export abstract class FileReader {
  constructor(
    protected readonly filePath: string,
    protected readonly logger: Logger,
  ) {}

  abstract read<T>(): T;

  protected readFile(): Buffer {
    if (!existsSync(this.filePath)) {
      this.logger.error(`File not found: ${this.filePath}`);
      throw new Error(`File not found: ${this.filePath}`);
    }

    this.logger.info(`File read: ${this.filePath}`);
    return readFileSync(this.filePath);
  }
}
