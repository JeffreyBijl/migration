import { readdirSync } from "fs";
import { join } from "path";
import type { Logger } from "../core/logger.ts";
import type { MigrationStore } from "../core/migration-store.ts";
import type { MigrationPipeline } from "../models/pipeline.interface.ts";
import type { AuftragIni } from "../models/auftrag-ini.interface.ts";
import type { MigrationConfig } from "../models/migration-config.interface.ts";
import type { MigrationPatient } from "../models/patient-migration.ts";
import { IniReader } from "../readers/ini-reader.ts";
import { PatientTransformer } from "../transformers/patient-transformer.ts";
import { AuftragValidator } from "../validators/auftrag-validator.ts";
import { CsvWriter } from "../writers/csv-writer.ts";

export class PatientPipeline implements MigrationPipeline {
  run(
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
