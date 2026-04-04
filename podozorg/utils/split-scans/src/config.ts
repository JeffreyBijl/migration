export interface Config {
  folderPath: string;
  outputFolder: string;
  logsFolder: string;
  thumbnailSize: number;
  targetPPI: number;
  concurrency: number;
}

export const defaultConfig: Config = {
  folderPath: "./img",
  outputFolder: "./output",
  logsFolder: "./logs",
  thumbnailSize: 150,
  targetPPI: 72,
  concurrency: 20,
};
