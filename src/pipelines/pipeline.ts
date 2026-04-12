import type { DataSource } from "../sources/dataSource.ts";
import type { Mapper } from "../mappers/mapper.ts";
import type { Validator } from "../validators/validator.ts";
import type { Writer } from "../writers/writer.ts";

export class Pipeline<TRaw, TOut> {
  constructor(
    private readonly sourceName: string,
    private readonly source: DataSource<TRaw[]>,
    private readonly validator: Validator<TRaw>,
    private readonly mapper: Mapper<TRaw, TOut>,
    private readonly writer: Writer<TOut>,
  ) {}

  public run(): void {
    console.log(`Starting pipeline for "${this.sourceName}"`);

    const rawItems = this.source.read();
    const validItems: TRaw[] = [];
    let invalidCount = 0;

    for (const item of rawItems) {
      const validationResult = this.validator.validate(item);
      if (validationResult.isValid) {
        validItems.push(item);
      } else {
        invalidCount++;
        console.log(validationResult.reason);
      }
    }

    const mappedItems = this.mapper.map(validItems);
    this.writer.write(mappedItems);

    console.log(`Finished: ${validItems.length} valid, ${invalidCount} invalid`);
  }
}
