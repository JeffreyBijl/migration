import type { Logger } from "../logger.ts";

export abstract class Transformer<TInput, TOutput> {
  constructor(protected readonly logger: Logger) {}

  abstract transform(input: TInput): TOutput;
}
