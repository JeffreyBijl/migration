export function mapVersandartToIsUrgent(versandart: string | undefined): boolean {
  if (versandart === undefined) return false;
  return versandart.trim().toLowerCase() === "express";
}
