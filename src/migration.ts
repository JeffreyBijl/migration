import { readdirSync } from "fs";
import { join } from "path";
import { Logger } from "./logger.ts";
import { MigrationStore } from "./migration-store.ts";
import type { AuftragIni } from "./models/auftrag-ini.interface.ts";
import type { Tenant } from "./models/generated.ts";
import type { MigrationPatient } from "./models/patient-migration.ts";
import type { MigrationConfig } from "./models/migration-config.interface.ts";
import type { TenantJson } from "./models/tenant-json.interface.ts";
import { IniReader } from "./readers/ini-reader.ts";
import { JsonReader } from "./readers/json-reader.ts";
import { PatientTransformer } from "./transformers/patient-transformer.ts";
import { TenantTransformer } from "./transformers/tenant-transformer.ts";
import { AuftragValidator } from "./validators/auftrag-validator.ts";
import { TenantValidator } from "./validators/tenant-validator.ts";
import { CsvWriter } from "./writers/csv-writer.ts";

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
    this.runTenants(config, logger, migrationStore);
    this.runPatients(config, logger, migrationStore);
    migrationStore.save();
  }

  private runTenants(
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

  private runPatients(
    config: MigrationConfig,
    logger: Logger,
    migrationStore: MigrationStore,
  ): void {
    const auftrags = readdirSync(config.iniDir)
      .filter((f) => f.endsWith("_Auftrag.ini"))
      .sort();

    logger.info(`Found ${auftrags.length} Auftrag.ini files`);

    const transformer = new PatientTransformer(logger, migrationStore);
    const patients: MigrationPatient[] = [];

    for (const auftrag of auftrags) {
      const filePath = join(config.iniDir, auftrag);
      const reader = new IniReader(filePath, logger);
      const data = reader.read<AuftragIni>();

      const validator = new AuftragValidator(data, logger);
      const errors = validator.validate();
      if (errors.length > 0) {
        logger.warn(`Skipping ${auftrag}: ${errors.join(", ")}`);
        continue;
      }

      const patient = transformer.transform(data);
      if (!patient) {
        continue;
      }
      patients.push(patient);
    }

    new CsvWriter<MigrationPatient>(
      join(config.outputDir, "patients.csv"),
      logger,
    ).write(patients);
  }
}
