export interface ValidationResult {
  isValid: boolean;
  reason: string;
}

export interface Validator<T> {
  validate(item: T): ValidationResult;
}
