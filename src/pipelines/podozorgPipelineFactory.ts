import { PodozorgConsultMapper } from "../mappers/podozorgConsultMapper.ts";
import { PodozorgPatientMapper } from "../mappers/podozorgPatientMapper.ts";
import { PodozorgTenantMapper } from "../mappers/podozorgTenantMapper.ts";
import { PodozorgTenantRefResolver } from "../resolvers/podozorgTenantRefResolver.ts";
import { InMemoryDataSource } from "../sources/inMemoryDataSource.ts";
import { JsonDataSource } from "../sources/jsonDataSource.ts";
import { PodozorgIniDirectoryDataSource } from "../sources/podozorgIniDirectoryDataSource.ts";
import type { PodozorgTenant } from "../types/podozorgTenant.ts";
import { PodozorgAuftragIniValidator } from "../validators/podozorgAuftragIniValidator.ts";
import { PodozorgTenantJsonValidator } from "../validators/podozorgTenantJsonValidator.ts";
import { CsvWriter } from "../writers/csvWriter.ts";
import { Pipeline } from "./pipeline.ts";

export class PodozorgPipelineFactory {
  public create(): Pipeline<any, any>[] {
    const tenants = new JsonDataSource<PodozorgTenant[]>(
      "podozorg/data/json/tenants-data.json",
    ).read();
    const tenantRefResolver = new PodozorgTenantRefResolver(tenants);

    const auftrags = new PodozorgIniDirectoryDataSource("podozorg/data/ini").read();

    return [
      new Pipeline(
        "podozorg-tenants",
        new InMemoryDataSource(tenants),
        new PodozorgTenantJsonValidator(),
        new PodozorgTenantMapper(tenantRefResolver),
        new CsvWriter("output/tenants.csv"),
      ),
      new Pipeline(
        "podozorg-patients",
        new InMemoryDataSource(auftrags),
        new PodozorgAuftragIniValidator(),
        new PodozorgPatientMapper(tenantRefResolver),
        new CsvWriter("output/patients.csv"),
      ),
      new Pipeline(
        "podozorg-consults",
        new InMemoryDataSource(auftrags),
        new PodozorgAuftragIniValidator(),
        new PodozorgConsultMapper(tenantRefResolver),
        new CsvWriter("output/consults.csv"),
      ),
    ];
  }
}
