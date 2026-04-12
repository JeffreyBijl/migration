// TODO: volledige vertaaltabel van vrij tekstveld Diagnose.Diagnose
//       naar Insolution profile_b_diagnosis-waarden opstellen.
export function mapDiagnoseToProfileBDiagnosis(diagnose: string | undefined): string | null {
  if (diagnose === undefined) return null;

  const trimmed = diagnose.trim();
  if (trimmed === "") return null;

  return trimmed;
}
