import * as fs from "node:fs/promises";
import * as path from "node:path";
import sharp from "sharp";
import { type Config, defaultConfig } from "./config.ts";
import {
  FILE_EXTENSION,
  calculateDimensions,
  calculateThumbnailDimensions,
  generateOutputPaths,
} from "./split.ts";

interface SplitResult {
  success: boolean;
  filePath: string;
  logMessage?: string;
  error?: string;
  extraInfo?: string;
}

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function processWithConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number
): Promise<R[]> {
  const total = items.length;
  let completed = 0;
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    const chunkResults = await Promise.all(
      chunk.map(async (item) => {
        const start = Date.now();
        const result = await fn(item);
        completed++;
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        console.log(`[${completed}/${total}] done in ${elapsed}s`);
        return result;
      })
    );
    results.push(...chunkResults);
  }
  return results;
}

async function splitImage(
  filePath: string,
  config: Config,
  thumbDims: ReturnType<typeof calculateThumbnailDimensions>
): Promise<SplitResult> {
  let metadata: sharp.Metadata | undefined;
  let dims: ReturnType<typeof calculateDimensions> | undefined;

  try {
    const image = sharp(filePath).withMetadata();
    metadata = await image.metadata();

    const currentPPI = metadata.density || config.targetPPI;

    console.log(`  ${path.basename(filePath)} (${metadata.width}x${metadata.height}, ${currentPPI}ppi)`);

    dims = calculateDimensions(
      metadata.width!,
      metadata.height!,
      currentPPI,
      config.targetPPI
    );

    const paths = generateOutputPaths(filePath, config.outputFolder);

    if (
      dims.halfWidth <= 0 ||
      dims.newHeight <= 0 ||
      thumbDims.halfThumbnailSize <= 0 ||
      thumbDims.thumbnailSize <= 0
    ) {
      throw new Error("Invalid dimensions calculated for extraction");
    }

    await Promise.all([
      image
        .clone()
        .resize(dims.newWidth, dims.newHeight)
        .extract({
          left: 0,
          top: 0,
          width: dims.halfWidth,
          height: dims.newHeight,
        })
        .withMetadata({ density: config.targetPPI })
        .toFile(paths.leftFile),

      image
        .clone()
        .resize(dims.newWidth, dims.newHeight)
        .extract({
          left: dims.halfWidth,
          top: 0,
          width: dims.rightHalfWidth,
          height: dims.newHeight,
        })
        .withMetadata({ density: config.targetPPI })
        .toFile(paths.rightFile),

      image
        .clone()
        .resize(thumbDims.thumbnailSize, thumbDims.thumbnailSize, { fit: "cover" })
        .extract({
          left: 0,
          top: 0,
          width: thumbDims.halfThumbnailSize,
          height: thumbDims.thumbnailSize,
        })
        .toFile(paths.leftThumbnailFile),

      image
        .clone()
        .resize(thumbDims.thumbnailSize, thumbDims.thumbnailSize, { fit: "cover" })
        .extract({
          left: thumbDims.halfThumbnailSize,
          top: 0,
          width: thumbDims.rightThumbnailWidth,
          height: thumbDims.thumbnailSize,
        })
        .toFile(paths.rightThumbnailFile),
    ]);

    const formattedDateTime = new Date().toLocaleString();
    const logMessage = `${formattedDateTime} - Split ${filePath} succeeded - Left: ${paths.leftFile}, Right: ${paths.rightFile}`;

    return { success: true, filePath, logMessage };
  } catch (err) {
    const formattedDateTime = new Date().toLocaleString();
    const error = toErrorMessage(err);

    console.error(`Error splitting image ${filePath}: ${error}`);

    let extraInfo = "";
    if (error.includes("bad extract area")) {
      extraInfo = ` - Image info: original width=${metadata?.width || "unknown"}, height=${metadata?.height || "unknown"}, density=${metadata?.density || "unknown"}, calculated width=${dims?.newWidth || "unknown"}, height=${dims?.newHeight || "unknown"}, halfWidth=${dims?.halfWidth || "unknown"}, rightHalfWidth=${dims?.rightHalfWidth || "unknown"}`;
    }

    const errorLog = `${formattedDateTime} - Error splitting image ${filePath}: ${error}${extraInfo}`;
    return { success: false, filePath, error, extraInfo: errorLog };
  }
}

async function processFolder(config: Config): Promise<void> {
  const runTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const errorLogFile = path.join(
    config.logsFolder,
    `errors-${runTimestamp}.txt`
  );
  const successLogFile = path.join(
    config.logsFolder,
    `success-${runTimestamp}.txt`
  );

  const errors: string[] = [];
  const successes: string[] = [];

  try {
    await Promise.all([
      fs.mkdir(config.outputFolder, { recursive: true }),
      fs.mkdir(config.logsFolder, { recursive: true }),
    ]);

    const thumbDims = calculateThumbnailDimensions(config.thumbnailSize);

    const files = await fs.readdir(config.folderPath);
    const jpgFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === FILE_EXTENSION
    );

    console.log(`Found ${jpgFiles.length} JPG files. Processing with concurrency ${config.concurrency}...`);
    const startTime = Date.now();

    const results = await processWithConcurrency(
      jpgFiles,
      async (file) => {
        const filePath = path.join(config.folderPath, file);
        return splitImage(filePath, config, thumbDims);
      },
      config.concurrency
    );

    const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\nCompleted in ${totalElapsed}s`);

    for (const result of results) {
      if (result.success && result.logMessage) {
        successes.push(result.logMessage);
      } else if (!result.success) {
        errors.push(result.extraInfo || `Unknown error for ${result.filePath}`);
      }
    }
  } catch (err) {
    const error = toErrorMessage(err);
    console.error(`An error occurred: ${error}`);
    const formattedDateTime = new Date().toLocaleString();
    errors.push(
      `${formattedDateTime} - Error processing folder: ${error}`
    );
  } finally {
    if (errors.length > 0) {
      await fs.writeFile(errorLogFile, errors.join("\n") + "\n");
      console.log(`\n${errors.length} error(s) logged to: ${errorLogFile}`);
    }
    if (successes.length > 0) {
      await fs.writeFile(successLogFile, successes.join("\n") + "\n");
      console.log(
        `${successes.length} file(s) processed successfully, log: ${successLogFile}`
      );
    }
    if (errors.length === 0) {
      console.log("\nNo errors during this run!");
    }
  }
}

processFolder(defaultConfig);
