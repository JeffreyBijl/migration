export interface MigrationConfig {
  source: "podozorg" | "podomasters" | "lft";
  inputDir: string;
  outputDir: string;
  iniDir: string;
  jsonDir: string;
}
