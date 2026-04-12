import type { DataSource } from "../sources/dataSource.ts";
import type { Mapper } from "../mappers/mapper.ts";
import type { Validator } from "../validators/validator.ts";
import type { Writer } from "../writers/writer.ts";
import type { PipelineObserver } from "../observers/pipelineObserver.ts";

export class Pipeline<TRaw, TOut> {
  private observers: PipelineObserver[] = [];

  constructor(
    private readonly sourceName: string,
    private readonly source: DataSource<TRaw[]>,
    private readonly validator: Validator<TRaw>,
    private readonly mapper: Mapper<TRaw, TOut>,
    private readonly writer: Writer<TOut>,
  ) {}

  public subscribe(observer: PipelineObserver): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: PipelineObserver): void {
    this.observers = this.observers.filter((existing) => existing !== observer);
  }

  public run(): void {
    this.notifyPipelineStarted();

    const rawItems = this.source.read();
    const validItems: TRaw[] = [];
    let invalidCount = 0;

    for (const item of rawItems) {
      const validationResult = this.validator.validate(item);
      if (validationResult.isValid) {
        validItems.push(item);
      } else {
        invalidCount++;
        this.notifyValidationFailed(item, validationResult.reason);
      }
    }

    const mappedItems = this.mapper.map(validItems);
    this.writer.write(mappedItems);

    this.notifyPipelineFinished(validItems.length, invalidCount);
  }

  private notifyPipelineStarted(): void {
    for (const observer of this.observers) {
      observer.onPipelineStarted(this.sourceName);
    }
  }

  private notifyValidationFailed(item: unknown, reason: string): void {
    for (const observer of this.observers) {
      observer.onValidationFailed(item, reason);
    }
  }

  private notifyPipelineFinished(validCount: number, invalidCount: number): void {
    for (const observer of this.observers) {
      observer.onPipelineFinished(validCount, invalidCount);
    }
  }
}
