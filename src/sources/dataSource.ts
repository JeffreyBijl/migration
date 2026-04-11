export interface DataSource<T> {
  read(): T;
}
