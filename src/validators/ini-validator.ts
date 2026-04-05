import { Validator } from "./validator.ts";

export abstract class IniValidator<T> extends Validator<T> {
  protected abstract readonly requiredFields: Record<string, string[]>;

  validate(): string[] {
    const errors: string[] = [];

    for (const [section, fields] of Object.entries(this.requiredFields)) {
      const sectionData = (this.data as Record<string, Record<string, string>>)[section];

      if (!sectionData) {
        const message = `Missing section: ${section}`;
        this.logger.error(message);
        errors.push(message);
        continue;
      }

      for (const field of fields) {
        if (!sectionData[field]) {
          const message = `Missing or empty field: ${section}.${field}`;
          this.logger.error(message);
          errors.push(message);
        }
      }
    }

    if (errors.length === 0) {
      this.logger.info("Validation passed");
    }

    return errors;
  }
}
