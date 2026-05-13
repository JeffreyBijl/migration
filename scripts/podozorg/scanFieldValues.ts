import { scanFieldValues } from "./valueMappingScanner.ts";

function printUsageAndExit(): never {
  process.stderr.write("Usage: npm run scan -- <Section> <Field>\n");
  process.stderr.write("Example: npm run scan -- Werkstatt Fraesmaterial\n");
  process.exit(1);
}

const section = process.argv[2];
const field = process.argv[3];
if (section === undefined || field === undefined) {
  printUsageAndExit();
}

scanFieldValues(section, field);
