import { readdirSync } from "fs";
import { join } from "path";
import type { PodozorgAuftrag } from "../types/podozorgAuftrag.ts";
import type { DataSource } from "./dataSource.ts";
import { IniDataSource } from "./iniDataSource.ts";

export class PodozorgIniDirectoryDataSource implements DataSource<PodozorgAuftrag[]> {
  constructor(private readonly directoryPath: string) {}

  public read(): PodozorgAuftrag[] {
    const auftragFileNames = readdirSync(this.directoryPath)
      .filter((fileName) => fileName.endsWith("_Auftrag.ini"))
      .sort();

    return auftragFileNames.map((fileName) =>
      new IniDataSource<PodozorgAuftrag>(join(this.directoryPath, fileName)).read(),
    );
  }
}
