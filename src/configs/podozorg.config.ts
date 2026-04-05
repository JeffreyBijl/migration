import type { MigrationConfig } from "../models/migration-config.interface.ts";

export const podozorgConfig: MigrationConfig = {
  source: "podozorg",
  inputDir: "podozorg/data",
  iniDir: "podozorg/data/ini",
  jsonDir: "podozorg/data/json",
  outputDir: "output",
};
