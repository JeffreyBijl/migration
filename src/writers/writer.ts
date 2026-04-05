import type { Logger } from "../logger.ts";

export abstract class Writer<T> {
  constructor(
    protected readonly outputPath: string,
    protected readonly logger: Logger,
  ) {}

  abstract write(data: T[]): void;
}
