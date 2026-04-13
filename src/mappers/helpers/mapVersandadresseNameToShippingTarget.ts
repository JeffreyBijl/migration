import { EShippingTarget } from "../../generated.ts";

export function mapVersandadresseNameToShippingTarget(
  name: string | undefined,
  tenantName: string,
): EShippingTarget {
  if (name === undefined) return EShippingTarget.Patient;
  if (name.trim().toLowerCase() === tenantName.trim().toLowerCase()) {
    return EShippingTarget.Tenant;
  }
  return EShippingTarget.Patient;
}
