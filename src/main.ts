import { JsonDataSource } from "./sources/jsonDataSource.ts";
import { PodozorgTenantMapper } from "./mappers/podozorgTenantMapper.ts";
import { PodozorgTenantValidator } from "./validators/podozorgTenantValidator.ts";
import { CsvWriter } from "./writers/csvWriter.ts";
import { Pipeline } from "./pipeline.ts";

const source = process.argv[2];

const pipelines: Record<string, Pipeline<any, any>[]> = {
  podozorg: [
    new Pipeline(
      new JsonDataSource("podozorg/data/json/tenants-data.json"),
      new PodozorgTenantValidator(),
      new PodozorgTenantMapper(),
      new CsvWriter("output/tenants.csv"),
    ),
  ],
};

const selected = pipelines[source];
if (!selected) {
  console.log(`Unknown source: "${source}". Options: ${Object.keys(pipelines).join(", ")}`);
  process.exit(1);
}

for (const pipeline of selected) {
  pipeline.run();
}
