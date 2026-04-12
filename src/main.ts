import { InMemoryDataSource } from "./sources/inMemoryDataSource.ts";
import { JsonDataSource } from "./sources/jsonDataSource.ts";
import { PodozorgIniDirectoryDataSource } from "./sources/podozorgIniDirectoryDataSource.ts";
import { PodozorgPatientMapper } from "./mappers/podozorgPatientMapper.ts";
import { PodozorgTenantRefResolver } from "./resolvers/podozorgTenantRefResolver.ts";
import { PodozorgTenantMapper } from "./mappers/podozorgTenantMapper.ts";
import { PodozorgAuftragIniValidator } from "./validators/podozorgAuftragIniValidator.ts";
import { PodozorgTenantJsonValidator } from "./validators/podozorgTenantJsonValidator.ts";
import { CsvWriter } from "./writers/csvWriter.ts";
import { Pipeline } from "./pipeline/pipeline.ts";
import { ConsolePipelineObserver } from "./observers/consolePipelineObserver.ts";
import type { PodozorgTenant } from "./types/podozorgTenant.ts";

const source = process.argv[2];

const podozorgTenants = new JsonDataSource<PodozorgTenant[]>(
  "podozorg/data/json/tenants-data.json",
).read();
const podozorgTenantRefResolver = new PodozorgTenantRefResolver(podozorgTenants);

const pipelines: Record<string, Pipeline<any, any>[]> = {
  podozorg: [
    new Pipeline(
      "podozorg-tenants",
      new InMemoryDataSource(podozorgTenants),
      new PodozorgTenantJsonValidator(),
      new PodozorgTenantMapper(podozorgTenantRefResolver),
      new CsvWriter("output/tenants.csv"),
    ),
    new Pipeline(
      "podozorg-patients",
      new PodozorgIniDirectoryDataSource("podozorg/data/ini"),
      new PodozorgAuftragIniValidator(),
      new PodozorgPatientMapper(podozorgTenantRefResolver),
      new CsvWriter("output/patients.csv"),
    ),
  ],
};

const selected = pipelines[source];
if (!selected) {
  console.log(`Unknown source: "${source}". Options: ${Object.keys(pipelines).join(", ")}`);
  process.exit(1);
}

for (const pipeline of selected) {
  pipeline.subscribe(new ConsolePipelineObserver());
  pipeline.run();
}
