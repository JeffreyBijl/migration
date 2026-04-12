export function parseErstelltToIsoString(erstellt: string): string {
  const trimmed = erstellt.trim().replace(/\s+/, " ");
  const [datePart, timePart] = trimmed.split(" ");

  if (!datePart || !timePart) {
    throw new Error(`Unexpected Erstellt format: "${erstellt}", expected dd.MM.yyyy HH:mm:ss`);
  }

  const dateSegments = datePart.split(".");
  if (dateSegments.length !== 3) {
    throw new Error(`Unexpected Erstellt date: "${datePart}", expected dd.MM.yyyy`);
  }

  const timeSegments = timePart.split(":");
  if (timeSegments.length !== 3) {
    throw new Error(`Unexpected Erstellt time: "${timePart}", expected HH:mm:ss`);
  }

  const [day, month, year] = dateSegments;
  const [hours, minutes, seconds] = timeSegments;
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}
