import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import pLimit from 'p-limit';
import { convertJpgToDicom, resolveDcmtkTools } from './dicom-writer.js';

export function parseArgs(args: string[]): { dir: string; dcmtkDir: string } {
  const dirIndex = args.indexOf('--dir');
  const dir = dirIndex !== -1 && args[dirIndex + 1] ? args[dirIndex + 1] : 'scans';

  const dcmtkIndex = args.indexOf('--dcmtk-dir');
  const dcmtkDir = dcmtkIndex !== -1 && args[dcmtkIndex + 1] ? args[dcmtkIndex + 1] : 'bin';

  return { dir, dcmtkDir };
}

export async function findJpgFiles(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir);
  return entries
    .filter(f => f.toLowerCase().endsWith('.jpg'))
    .filter(f => !f.toLowerCase().includes('.thumb'))
    .map(f => path.resolve(dir, f));
}

async function main() {
  const { dir, dcmtkDir } = parseArgs(process.argv.slice(2));
  console.log(`Convert-to-DICOM (DCMTK)`);
  console.log(`Directory: ${dir}`);
  console.log(`DCMTK dir: ${dcmtkDir}`);

  const tools = resolveDcmtkTools(dcmtkDir);
  if (!tools) {
    console.error(`DCMTK tools not found in: ${dcmtkDir}`);
    process.exit(1);
  }

  const startTime = Date.now();
  const jpgFiles = await findJpgFiles(dir);

  if (jpgFiles.length === 0) {
    console.log('No JPG files found.');
    process.exit(0);
  }

  console.log(`Found ${jpgFiles.length} JPG files. Converting...`);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputDir = path.resolve(__dirname, '..', 'output');
  await fs.promises.mkdir(outputDir, { recursive: true });

  const limit = pLimit(4);
  let successCount = 0;
  const errors: string[] = [];

  const tasks = jpgFiles.map((jpgPath, index) =>
    limit(async () => {
      const basename = path.basename(jpgPath);
      const result = await convertJpgToDicom(tools, jpgPath, outputDir, index + 1);
      if (result.ok) {
        successCount++;
        console.log(`  ✓ ${basename}`);
      } else {
        errors.push(`${basename}: ${result.error}`);
        console.log(`  ✗ ${basename}: ${result.error}`);
      }
    })
  );

  await Promise.all(tasks);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Done in ${duration}s`);
  console.log(`Converted: ${successCount}`);
  if (errors.length > 0) {
    console.log(`Failed: ${errors.length}`);
    errors.forEach(e => console.log(`  - ${e}`));

    const logsDir = path.resolve(parentDir, 'logs');
    await fs.promises.mkdir(logsDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logPath = path.join(logsDir, `failed-${timestamp}.txt`);
    const logContent = `Convert-to-DICOM — ${new Date().toISOString()}\n`
      + `Directory: ${dir}\n`
      + `Total: ${jpgFiles.length} | Converted: ${successCount} | Failed: ${errors.length}\n`
      + `Duration: ${duration}s\n\n`
      + `Failed scans:\n`
      + errors.map(e => `  - ${e}`).join('\n') + '\n';
    await fs.promises.writeFile(logPath, logContent);
    console.log(`\nLog written to: ${logPath}`);
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

// Only run main when executed directly (not imported by tests)
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
