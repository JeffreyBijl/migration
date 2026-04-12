import type { Patient } from "../generated.ts";

export type InsolutionPatient = Omit<Patient, "__typename">;
