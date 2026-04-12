import type { DataSource } from "./dataSource.ts";

export class InMemoryDataSource<T> implements DataSource<T> {
  constructor(private readonly data: T) {}

  public read(): T {
    return this.data;
  }
}
