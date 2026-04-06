import { existsSync, readFileSync, writeFileSync } from "fs";

interface PatientNumberState {
  counters: Record<string, number>;
  assignments: Record<string, string>;
}

// TODO: Replace local JSON storage with AWS migration table
export class MigrationStore {
  private tenantRefs = new Map<string, string>();
  private patientNumberState: PatientNumberState;

  constructor(private readonly patientNumbersPath: string) {
    this.patientNumberState = existsSync(patientNumbersPath)
      ? JSON.parse(readFileSync(patientNumbersPath, "utf-8"))
      : { counters: {}, assignments: {} };
  }

  setTenantRef(tenantId: string, tenantRef: string): void {
    this.tenantRefs.set(tenantId, tenantRef);
  }

  getTenantRef(tenantId: string): string | undefined {
    return this.tenantRefs.get(tenantId);
  }

  getPatientNumber(patientId: string, tenantId: string): string {
    const existing = this.patientNumberState.assignments[patientId];
    if (existing) {
      return existing;
    }

    const counter = (this.patientNumberState.counters[tenantId] ?? 99) + 1;
    this.patientNumberState.counters[tenantId] = counter;

    const patientNumber = `M-${counter}`;
    this.patientNumberState.assignments[patientId] = patientNumber;
    return patientNumber;
  }

  save(): void {
    writeFileSync(
      this.patientNumbersPath,
      JSON.stringify(this.patientNumberState, null, 2),
    );
  }
}
