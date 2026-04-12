import { PodozorgPipelineFactory } from "./pipelines/podozorgPipelineFactory.ts";

const pipelines = new PodozorgPipelineFactory().create();

for (const pipeline of pipelines) {
  pipeline.run();
}
