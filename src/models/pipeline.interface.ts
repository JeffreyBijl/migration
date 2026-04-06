import type { Logger } from "../core/logger.ts";
import type { MigrationStore } from "../core/migration-store.ts";
import type { MigrationConfig } from "./migration-config.interface.ts";

export interface MigrationPipeline {
  run(
    config: MigrationConfig,
    logger: Logger,
    migrationStore: MigrationStore,
  ): void;
}
