import type { DataSource } from "./sources/dataSource.ts";
import type { Mapper } from "./mappers/mapper.ts";
import type { Validator } from "./validators/validator.ts";
import type { Writer } from "./writers/writer.ts";

export class Pipeline<TRaw, TOut> {
  constructor(
    private source: DataSource<TRaw[]>,
    private validator: Validator<TRaw>,
    private mapper: Mapper<TRaw, TOut>,
    private writer: Writer<TOut>,
  ) {}

  run(): void {
    const raw = this.source.read();
    const valid = raw.filter((item) => this.validator.validate(item));
    const results = this.mapper.map(valid);
    this.writer.write(results);
  }
}
