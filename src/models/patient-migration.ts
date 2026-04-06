import type { Patient } from "./generated.ts";

export type MigrationPatient = Omit<
  Patient,
  "__typename" | "anonymized_at" | "anonymized_by"
>;
