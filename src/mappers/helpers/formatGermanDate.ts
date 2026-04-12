export function formatGermanDate(germanDate: string): string {
  const segments = germanDate.split(".");
  if (segments.length !== 3) {
    throw new Error(`Unexpected date format: "${germanDate}", expected dd.MM.yyyy`);
  }

  const [day, month, year] = segments;
  return `${year}-${month}-${day}`;
}
