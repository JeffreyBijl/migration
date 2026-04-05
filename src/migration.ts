import { readdirSync } from "fs";
import { join } from "path";
import { Logger } from "./logger.ts";
import { MigrationStore } from "./migration-store.ts";
import type { AuftragIni } from "./models/auftrag-ini.interface.ts";
import type { CreatePatientInput, Tenant } from "./models/generated.ts";
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
    const context = new MigrationStore();
    this.runTenants(config, logger, context);
    this.runPatients(config, logger, context);
  }

  private runTenants(
    config: MigrationConfig,
    logger: Logger,
    context: MigrationStore,
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
      context.setTenantRef(tenant.id, tenant.tenant_ref);
    }

    new CsvWriter<Tenant>(join(config.outputDir, "tenants.csv"), logger).write(
      tenants,
    );
  }

  private runPatients(
    config: MigrationConfig,
    logger: Logger,
    context: MigrationStore,
  ): void {
    const auftrags = readdirSync(config.iniDir)
      .filter((f) => f.endsWith("_Auftrag.ini"))
      .sort();

    logger.info(`Found ${auftrags.length} Auftrag.ini files`);

    const transformer = new PatientTransformer(logger, context);
    const patients: CreatePatientInput[] = [];

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

      patients.push(transformer.transform(data));
    }

    new CsvWriter<CreatePatientInput>(
      join(config.outputDir, "patients.csv"),
      logger,
    ).write(patients);
  }
}
