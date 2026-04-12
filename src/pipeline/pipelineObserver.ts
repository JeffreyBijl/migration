export interface PipelineObserver {
  onPipelineStarted(sourceName: string): void;
  onValidationFailed(item: unknown, reason: string): void;
  onPipelineFinished(validCount: number, invalidCount: number): void;
}
