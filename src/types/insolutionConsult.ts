import type { Consult, EFootType } from "../generated.ts";

export type InsolutionConsult = Omit<Consult, "__typename"> & {
  profile_b_diagnosis: string | null;
  profile_b_foot_type_left: EFootType | null;
  profile_b_foot_type_right: EFootType | null;
  enable_reminder: boolean;
};
