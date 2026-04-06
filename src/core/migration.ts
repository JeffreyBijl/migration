import { join } from "path";
import { Logger } from "./logger.ts";
import { MigrationStore } from "./migration-store.ts";
import type { MigrationPipeline } from "../models/pipeline.interface.ts";
import type { MigrationConfig } from "../models/migration-config.interface.ts";
import { PatientPipeline } from "../pipelines/patient-pipeline.ts";
import { TenantPipeline } from "../pipelines/tenant-pipeline.ts";

export class Migration {
  start(config: MigrationConfig): void {
    const logger = new Logger("logs/migration.log");
    logger.info(`Starting migration: source=${config.source}`);

    switch (config.source) {
      case "podozorg":
        this.runPodozorg(config, logger);
        break;
      default:
        throw new Error(`Source "${config.source}" is not yet supported`);
    }

    logger.summary();
  }

  private runPodozorg(config: MigrationConfig, logger: Logger): void {
    const migrationStore = new MigrationStore(
      join(config.outputDir, "patient-numbers.json"),
    );

    const pipelines: MigrationPipeline[] = [
      new TenantPipeline(),
      new PatientPipeline(),
    ];

    for (const pipeline of pipelines) {
      pipeline.run(config, logger, migrationStore);
    }

    migrationStore.save();
  }
}
