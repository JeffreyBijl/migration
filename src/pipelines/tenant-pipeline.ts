import { join } from "path";
import type { Logger } from "../core/logger.ts";
import type { MigrationStore } from "../core/migration-store.ts";
import type { MigrationPipeline } from "../models/pipeline.interface.ts";
import type { Tenant } from "../models/generated.ts";
import type { MigrationConfig } from "../models/migration-config.interface.ts";
import type { TenantJson } from "../models/tenant-json.interface.ts";
import { JsonReader } from "../readers/json-reader.ts";
import { TenantTransformer } from "../transformers/tenant-transformer.ts";
import { TenantValidator } from "../validators/tenant-validator.ts";
import { CsvWriter } from "../writers/csv-writer.ts";

export class TenantPipeline implements MigrationPipeline {
  run(
    config: MigrationConfig,
    logger: Logger,
    migrationStore: MigrationStore,
  ): void {
    const filePath = join(config.jsonDir, "tenants-data.json");
    const reader = new JsonReader(filePath, logger);
    const data = reader.read<TenantJson[]>();

    logger.info(`Found ${data.length} tenants`);

    const validator = new TenantValidator(data, logger);
    const errors = validator.validate();
    if (errors.length > 0) {
      logger.warn(`Tenant validation failed: ${errors.join(", ")}`);
      return;
    }

    const transformer = new TenantTransformer(logger);
    const tenants = transformer.transform(data);

    for (const tenant of tenants) {
      migrationStore.setTenantRef(tenant.id, tenant.tenant_ref);
    }

    new CsvWriter<Tenant>(join(config.outputDir, "tenants.csv"), logger).write(
      tenants,
    );
  }
}
