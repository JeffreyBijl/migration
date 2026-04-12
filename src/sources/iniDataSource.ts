import { readFileSync } from "fs";
import { parse } from "ini";
import type { DataSource } from "./dataSource.ts";

export class IniDataSource<T> implements DataSource<T> {
  constructor(private readonly filePath: string) {}

  read(): T {
    const buffer = readFileSync(this.filePath);
    let content = buffer.toString("utf-16le");

    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }

    return parse(content) as T;
  }
}
