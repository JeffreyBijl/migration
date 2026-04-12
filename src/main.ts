import { ConsolePipelineObserver } from "./observers/consolePipelineObserver.ts";
import { PodozorgPipelineFactory } from "./pipelines/podozorgPipelineFactory.ts";

const observer = new ConsolePipelineObserver();
const pipelines = new PodozorgPipelineFactory().create();

for (const pipeline of pipelines) {
  pipeline.subscribe(observer);
  pipeline.run();
}
