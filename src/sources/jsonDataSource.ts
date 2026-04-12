import { readFileSync } from "fs";
import type { DataSource } from "./dataSource.ts";

export class JsonDataSource<T> implements DataSource<T> {
  constructor(private readonly filePath: string) {}

  read(): T {
    const buffer = readFileSync(this.filePath);
    let content = buffer.toString("utf-8");

    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }

    return JSON.parse(content) as T;
  }
}
