// TODO: alleen events bij validatie, of ook bij read/map/write stappen?
export interface PipelineObserver {
  onPipelineStarted(sourceName: string): void;
  onValidationFailed(item: unknown, reason: string): void;
  onPipelineFinished(validCount: number, invalidCount: number): void;
}
