export interface Validator<T> {
  validate(item: T): boolean;
}
