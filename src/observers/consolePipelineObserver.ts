import type { PipelineObserver } from "./pipelineObserver.ts";

export class ConsolePipelineObserver implements PipelineObserver {
  public onPipelineStarted(sourceName: string): void {
    console.log(`Starting pipeline for "${sourceName}"`);
  }

  public onValidationFailed(_item: unknown, reason: string): void {
    console.log(reason);
  }

  public onPipelineFinished(validCount: number, invalidCount: number): void {
    console.log(`Finished: ${validCount} valid, ${invalidCount} invalid`);
  }
}
