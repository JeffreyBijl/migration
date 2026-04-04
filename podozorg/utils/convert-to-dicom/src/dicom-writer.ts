import { execFile } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface DicomCreateResult {
  ok: boolean;
  error?: string;
}

export interface DcmtkTools {
  img2dcm: string;
  dcmodify: string;
}

interface ProcessResult {
  ok: boolean;
  code: number | null;
  errorText?: string;
}

function runProcess(toolPath: string, args: string[], cwd: string): Promise<ProcessResult> {
  return new Promise((resolve) => {
    execFile(toolPath, args, { cwd }, (error, _stdout, stderr) => {
      if (error) {
        resolve({
          ok: false,
          code: error.code ? Number(error.code) : null,
          errorText: stderr || error.message,
        });
      } else {
        resolve({ ok: true, code: 0 });
      }
    });
  });
}

/**
 * Resolve DCMTK tool paths once. Returns null if any tool is missing.
 */
export function resolveDcmtkTools(dcmtkDir: string): DcmtkTools | null {
  const resolved = path.resolve(dcmtkDir);
  const img2dcm = path.join(resolved, 'img2dcm.exe');
  const dcmodify = path.join(resolved, 'dcmodify.exe');

  if (!fs.existsSync(img2dcm) || !fs.existsSync(dcmodify)) {
    return null;
  }
  return { img2dcm, dcmodify };
}

function formatDS(value: number): string {
  return value.toPrecision(10).replace(/\.?0+$/, '');
}

const PIXEL_SPACING = `${formatDS(0.3528)}\\${formatDS(0.3528)}`;

/**
 * JPG -> DICOM Secondary Capture using DCMTK img2dcm + dcmodify.
 *
 * img2dcm writes the DICOM directly from the JPG input (no decompression needed).
 * dcmodify sets InstanceNumber and PixelSpacing afterward.
 */
export async function convertJpgToDicom(
  tools: DcmtkTools,
  jpgPath: string,
  outputDir: string,
  instanceNumber: number
): Promise<DicomCreateResult> {
  const stem = path.basename(jpgPath, path.extname(jpgPath));
  const dcmName = stem.replace('.cadLeft', '.dicomLeft').replace('.cadRight', '.dicomRight') + '.dcm';
  const outDcmPath = path.join(outputDir, dcmName);
  const cwd = path.dirname(tools.img2dcm);

  // 1) img2dcm: JPG -> DICOM Secondary Capture
  {
    const result = await runProcess(tools.img2dcm, ['-sc', jpgPath, outDcmPath], cwd);
    if (!result.ok) {
      return {
        ok: false,
        error: `img2dcm_failed:${result.errorText || `exit_code=${result.code}`}`,
      };
    }
  }

  // 2) dcmodify: set InstanceNumber and PixelSpacing
  {
    const args = [
      '-nb',
      '-i', `InstanceNumber=${instanceNumber}`,
      '-i', `PixelSpacing=${PIXEL_SPACING}`,
      outDcmPath,
    ];

    const result = await runProcess(tools.dcmodify, args, cwd);
    if (!result.ok) {
      try {
        await fs.promises.unlink(outDcmPath);
      } catch {
        // ignore cleanup failure
      }
      return {
        ok: false,
        error: `dcmodify_failed:${result.errorText || `exit_code=${result.code}`}`,
      };
    }
  }

  return { ok: true };
}
