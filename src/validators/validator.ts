import type { Logger } from "../core/logger.ts";

export abstract class Validator<T> {
  constructor(
    protected readonly data: T,
    protected readonly logger: Logger,
  ) {}

  abstract validate(): string[];
}
