# Image Split TypeScript Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the image-splitting script from JavaScript to TypeScript with separated pure logic, concurrency control, and Vitest tests.

**Architecture:** Three-file split: `config.ts` (types + defaults), `split.ts` (pure calculation functions), `main.ts` (orchestration with sharp + I/O). Tests cover only the pure functions.

**Tech Stack:** TypeScript, sharp, Vitest, tsx

**Spec:** `docs/superpowers/specs/2026-03-18-typescript-conversion-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/config.ts` | Config interface + defaultConfig |
| Create | `src/split.ts` | Pure calculation functions |
| Create | `src/main.ts` | Orchestration, sharp calls, I/O, logging |
| Create | `src/__tests__/split.test.ts` | Vitest tests for pure functions |
| Create | `tsconfig.json` | TypeScript configuration |
| Create | `vitest.config.ts` | Vitest configuration |
| Modify | `package.json` | Add devDependencies + scripts |
| Delete | `split.js` | Replaced by src/main.ts |

---

### Task 1: Project Setup

**Files:**
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install --save-dev typescript tsx vitest @types/node
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Update package.json scripts**

Replace the `scripts` section:

```json
{
  "scripts": {
    "start": "tsx src/main.ts",
    "test": "vitest run"
  }
}
```

- [ ] **Step 5: Verify setup compiles**

Run: `npx tsx --version`
Expected: version number printed, no errors

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json vitest.config.ts package.json package-lock.json
git commit -m "chore: add TypeScript, Vitest, tsx project setup"
```

---

### Task 2: Config Module

**Files:**
- Create: `src/config.ts`

- [ ] **Step 1: Create src/config.ts**

```typescript
export interface Config {
  folderPath: string;
  outputFolder: string;
  logsFolder: string;
  thumbnailSize: number;
  targetPPI: number;
  concurrency: number;
}

export const defaultConfig: Config = {
  folderPath: "./img",
  outputFolder: "./output",
  logsFolder: "./logs",
  thumbnailSize: 150,
  targetPPI: 72,
  concurrency: 10,
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsx -e "import { defaultConfig } from './src/config.ts'; console.log(defaultConfig)"`
Expected: prints the config object

- [ ] **Step 3: Commit**

```bash
git add src/config.ts
git commit -m "feat: add Config type and defaultConfig"
```

---

### Task 3: Pure Functions — calculateDimensions (TDD)

**Files:**
- Create: `src/split.ts`
- Create: `src/__tests__/split.test.ts`

- [ ] **Step 1: Write failing tests for calculateDimensions**

Create `src/__tests__/split.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  calculateDimensions,
  calculateThumbnailDimensions,
  generateOutputPaths,
} from "../split.ts";

describe("calculateDimensions", () => {
  it("preserves dimensions when density equals targetPPI", () => {
    const result = calculateDimensions(1000, 800, 72, 72);
    expect(result).toEqual({
      newWidth: 1000,
      newHeight: 800,
      halfWidth: 500,
      leftHalfWidth: 500,
      rightHalfWidth: 500,
    });
  });

  it("reverts both dimensions when higher density would downscale", () => {
    // 300 PPI -> 72 PPI: newWidth = round(1000/300*72) = 240 < 1000, so revert
    const result = calculateDimensions(1000, 800, 300, 72);
    expect(result).toEqual({
      newWidth: 1000,
      newHeight: 800,
      halfWidth: 500,
      leftHalfWidth: 500,
      rightHalfWidth: 500,
    });
  });

  it("upscales when density is lower than targetPPI", () => {
    // 36 PPI -> 72 PPI: newWidth = round(100/36*72) = 200 > 100, no revert
    const result = calculateDimensions(100, 80, 36, 72);
    expect(result).toEqual({
      newWidth: 200,
      newHeight: 160,
      halfWidth: 100,
      leftHalfWidth: 100,
      rightHalfWidth: 100,
    });
  });

  it("handles odd width correctly", () => {
    const result = calculateDimensions(1001, 800, 72, 72);
    expect(result.halfWidth).toBe(500);
    expect(result.leftHalfWidth).toBe(500);
    expect(result.rightHalfWidth).toBe(500);
  });

  it("clamps minimum dimensions", () => {
    const result = calculateDimensions(1, 1, 72, 72);
    expect(result.newWidth).toBe(2);
    expect(result.newHeight).toBe(2);
    expect(result.halfWidth).toBe(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run`
Expected: FAIL — `calculateDimensions` is not exported

- [ ] **Step 3: Implement calculateDimensions**

Create `src/split.ts`:

```typescript
export interface Dimensions {
  newWidth: number;
  newHeight: number;
  halfWidth: number;
  leftHalfWidth: number;
  rightHalfWidth: number;
}

export function calculateDimensions(
  width: number,
  height: number,
  density: number,
  targetPPI: number
): Dimensions {
  const widthInches = width / density;
  const heightInches = height / density;

  let newWidth = Math.round(widthInches * targetPPI);
  let newHeight = Math.round(heightInches * targetPPI);

  if (newWidth < width) {
    newWidth = width;
    newHeight = height;
  }

  newWidth = Math.max(newWidth, 2);
  newHeight = Math.max(newHeight, 2);

  const halfWidth = Math.max(Math.floor(newWidth / 2), 1);
  const leftHalfWidth = Math.min(halfWidth, newWidth);
  const rightHalfWidth = Math.min(halfWidth, newWidth - halfWidth);

  return { newWidth, newHeight, halfWidth, leftHalfWidth, rightHalfWidth };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run`
Expected: All 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/split.ts src/__tests__/split.test.ts
git commit -m "feat: add calculateDimensions with tests"
```

---

### Task 4: Pure Functions — calculateThumbnailDimensions (TDD)

**Files:**
- Modify: `src/split.ts`
- Modify: `src/__tests__/split.test.ts`

- [ ] **Step 1: Write failing tests for calculateThumbnailDimensions**

Append the following `describe` block to `src/__tests__/split.test.ts` (the import at the top already includes `calculateThumbnailDimensions`):

```typescript
describe("calculateThumbnailDimensions", () => {
  it("calculates default thumbnail size 150", () => {
    const result = calculateThumbnailDimensions(150);
    expect(result).toEqual({
      thumbnailSize: 150,
      halfThumbnailSize: 75,
      leftThumbnailWidth: 75,
      rightThumbnailWidth: 75,
    });
  });

  it("handles odd thumbnail size", () => {
    const result = calculateThumbnailDimensions(151);
    expect(result).toEqual({
      thumbnailSize: 151,
      halfThumbnailSize: 75,
      leftThumbnailWidth: 75,
      rightThumbnailWidth: 75,
    });
  });

  it("handles minimum thumbnail size of 1", () => {
    const result = calculateThumbnailDimensions(1);
    expect(result).toEqual({
      thumbnailSize: 1,
      halfThumbnailSize: 1,
      leftThumbnailWidth: 1,
      rightThumbnailWidth: 0,
    });
  });
});
```

- [ ] **Step 2: Run tests to verify new tests fail**

Run: `npx vitest run`
Expected: FAIL — `calculateThumbnailDimensions` is not exported

- [ ] **Step 3: Implement calculateThumbnailDimensions**

Add to `src/split.ts`:

```typescript
export interface ThumbnailDimensions {
  thumbnailSize: number;
  halfThumbnailSize: number;
  leftThumbnailWidth: number;
  rightThumbnailWidth: number;
}

export function calculateThumbnailDimensions(
  thumbnailSize: number
): ThumbnailDimensions {
  const halfThumbnailSize = Math.max(Math.floor(thumbnailSize / 2), 1);
  const leftThumbnailWidth = Math.min(halfThumbnailSize, thumbnailSize);
  const rightThumbnailWidth = Math.min(
    halfThumbnailSize,
    thumbnailSize - halfThumbnailSize
  );

  return { thumbnailSize, halfThumbnailSize, leftThumbnailWidth, rightThumbnailWidth };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run`
Expected: All 8 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/split.ts src/__tests__/split.test.ts
git commit -m "feat: add calculateThumbnailDimensions with tests"
```

---

### Task 5: Pure Functions — generateOutputPaths (TDD)

**Files:**
- Modify: `src/split.ts`
- Modify: `src/__tests__/split.test.ts`

- [ ] **Step 1: Write failing tests for generateOutputPaths**

Append the following `describe` block to `src/__tests__/split.test.ts` (the import at the top already includes `generateOutputPaths`):

```typescript
import * as path from "node:path";

describe("generateOutputPaths", () => {
  it("generates correct paths for a normal filename", () => {
    const result = generateOutputPaths("img/photo.jpg", "./output");
    expect(result).toEqual({
      leftFile: path.join("output", "photo-left.jpg"),
      rightFile: path.join("output", "photo-right.jpg"),
      leftThumbnailFile: path.join("output", "photo-thumbnail-left.jpg"),
      rightThumbnailFile: path.join("output", "photo-thumbnail-right.jpg"),
    });
  });

  it("discards directory from input path", () => {
    const result = generateOutputPaths("some/deep/path/image.jpg", "./output");
    expect(result).toEqual({
      leftFile: path.join("output", "image-left.jpg"),
      rightFile: path.join("output", "image-right.jpg"),
      leftThumbnailFile: path.join("output", "image-thumbnail-left.jpg"),
      rightThumbnailFile: path.join("output", "image-thumbnail-right.jpg"),
    });
  });

  it("handles filename with .jpg in middle", () => {
    const result = generateOutputPaths("img/photo.jpg.backup.jpg", "./output");
    expect(result).toEqual({
      leftFile: path.join("output", "photo.jpg.backup-left.jpg"),
      rightFile: path.join("output", "photo.jpg.backup-right.jpg"),
      leftThumbnailFile: path.join("output", "photo.jpg.backup-thumbnail-left.jpg"),
      rightThumbnailFile: path.join("output", "photo.jpg.backup-thumbnail-right.jpg"),
    });
  });
});
```

- [ ] **Step 2: Run tests to verify new tests fail**

Run: `npx vitest run`
Expected: FAIL — `generateOutputPaths` is not exported

- [ ] **Step 3: Implement generateOutputPaths**

Add to `src/split.ts`:

```typescript
import * as path from "node:path";

export interface OutputPaths {
  leftFile: string;
  rightFile: string;
  leftThumbnailFile: string;
  rightThumbnailFile: string;
}

export function generateOutputPaths(
  filePath: string,
  outputFolder: string
): OutputPaths {
  const basename = path.basename(filePath, ".jpg");

  return {
    leftFile: path.join(outputFolder, `${basename}-left.jpg`),
    rightFile: path.join(outputFolder, `${basename}-right.jpg`),
    leftThumbnailFile: path.join(outputFolder, `${basename}-thumbnail-left.jpg`),
    rightThumbnailFile: path.join(outputFolder, `${basename}-thumbnail-right.jpg`),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run`
Expected: All 11 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/split.ts src/__tests__/split.test.ts
git commit -m "feat: add generateOutputPaths with tests"
```

---

### Task 6: Orchestration — main.ts

**Files:**
- Create: `src/main.ts`

- [ ] **Step 1: Create src/main.ts with processWithConcurrency helper**

```typescript
import * as fs from "node:fs/promises";
import * as path from "node:path";
import sharp from "sharp";
import { type Config, defaultConfig } from "./config.ts";
import {
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

async function processWithConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
}

async function splitImage(
  filePath: string,
  config: Config
): Promise<SplitResult> {
  let metadata: sharp.Metadata | undefined;
  let dims: ReturnType<typeof calculateDimensions> | undefined;

  try {
    const image = sharp(filePath).withMetadata();
    metadata = await image.metadata();

    const currentPPI = metadata.density || config.targetPPI;

    console.log(
      `Verwerken van bestand: ${filePath}, Afmetingen: ${metadata.width}x${metadata.height}, Dichtheid: ${currentPPI}`
    );

    dims = calculateDimensions(
      metadata.width!,
      metadata.height!,
      currentPPI,
      config.targetPPI
    );

    const thumbDims = calculateThumbnailDimensions(config.thumbnailSize);
    const paths = generateOutputPaths(filePath, config.outputFolder);

    if (
      dims.halfWidth <= 0 ||
      dims.newHeight <= 0 ||
      thumbDims.halfThumbnailSize <= 0 ||
      thumbDims.thumbnailSize <= 0
    ) {
      throw new Error("Ongeldige afmetingen berekend voor extractie");
    }

    console.log(
      `Berekende afmetingen voor ${filePath}: newWidth=${dims.newWidth}, newHeight=${dims.newHeight}, halfWidth=${dims.halfWidth}`
    );
    console.log(
      `Extractie afmetingen voor ${filePath}: leftHalfWidth=${dims.leftHalfWidth}, rightHalfWidth=${dims.rightHalfWidth}, height=${dims.newHeight}`
    );

    await Promise.all([
      image
        .clone()
        .resize(dims.newWidth, dims.newHeight)
        .extract({
          left: 0,
          top: 0,
          width: dims.leftHalfWidth,
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
        .resize(thumbDims.thumbnailSize)
        .extract({
          left: 0,
          top: 0,
          width: thumbDims.leftThumbnailWidth,
          height: thumbDims.thumbnailSize,
        })
        .toFile(paths.leftThumbnailFile),

      image
        .clone()
        .resize(thumbDims.thumbnailSize)
        .extract({
          left: thumbDims.halfThumbnailSize,
          top: 0,
          width: thumbDims.rightThumbnailWidth,
          height: thumbDims.thumbnailSize,
        })
        .toFile(paths.rightThumbnailFile),
    ]);

    const formattedDateTime = new Date().toLocaleString();
    const logMessage = `${formattedDateTime} - Splitsen van ${filePath} gelukt - Left: ${paths.leftFile}, Right: ${paths.rightFile}`;
    console.log(logMessage);

    return { success: true, filePath, logMessage };
  } catch (err) {
    const formattedDateTime = new Date().toLocaleString();
    const error = err instanceof Error ? err.message : String(err);

    console.error(
      `Fout bij het splitsen van de afbeelding ${filePath}: ${error}`
    );

    let extraInfo = "";
    if (error.includes("bad extract area")) {
      extraInfo = ` - Afbeeldingsinfo: originele breedte=${metadata?.width || "onbekend"}, hoogte=${metadata?.height || "onbekend"}, dichtheid=${metadata?.density || "onbekend"}, berekende nieuwe breedte=${dims?.newWidth || "onbekend"}, hoogte=${dims?.newHeight || "onbekend"}, halfWidth=${dims?.halfWidth || "onbekend"}, leftHalfWidth=${dims?.leftHalfWidth || "onbekend"}, rightHalfWidth=${dims?.rightHalfWidth || "onbekend"}`;
    }

    const errorLog = `${formattedDateTime} - Fout bij het splitsen van de afbeelding ${filePath}: ${error}${extraInfo}`;
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
    await fs.mkdir(config.outputFolder, { recursive: true });
    await fs.mkdir(config.logsFolder, { recursive: true });

    const files = await fs.readdir(config.folderPath);
    const jpgFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".jpg"
    );

    const results = await processWithConcurrency(
      jpgFiles,
      async (file) => {
        const filePath = path.join(config.folderPath, file);
        return splitImage(filePath, config);
      },
      config.concurrency
    );

    for (const result of results) {
      if (result.success && result.logMessage) {
        successes.push(result.logMessage);
      } else if (!result.success && result.extraInfo) {
        errors.push(result.extraInfo);
      }
    }
  } catch (err) {
    console.error(
      `Er is een fout opgetreden: ${err instanceof Error ? err.message : String(err)}`
    );
    const formattedDateTime = new Date().toLocaleString();
    errors.push(
      `${formattedDateTime} - Er is een fout opgetreden bij het verwerken van de map: ${err instanceof Error ? err.message : String(err)}`
    );
  } finally {
    if (errors.length > 0) {
      await fs.writeFile(errorLogFile, errors.join("\n") + "\n");
      console.log(`\n${errors.length} fout(en) gelogd naar: ${errorLogFile}`);
    }
    if (successes.length > 0) {
      await fs.writeFile(successLogFile, successes.join("\n") + "\n");
      console.log(
        `${successes.length} bestand(en) succesvol verwerkt, log: ${successLogFile}`
      );
    }
    if (errors.length === 0) {
      console.log("\nGeen fouten tijdens deze run!");
    }
  }
}

processFolder(defaultConfig);
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsx src/main.ts --help 2>&1 || true`
Expected: Script runs (may error about missing `./img` folder in test env, but compiles)

- [ ] **Step 3: Commit**

```bash
git add src/main.ts
git commit -m "feat: add main.ts orchestration with concurrency support"
```

---

### Task 7: Integration Test & Cleanup

**Files:**
- Delete: `split.js`
- Delete: `error.log` (old log file)
- Delete: `success.log` (old log file)

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All 11 tests PASS

- [ ] **Step 2: Run the script against real images (manual smoke test)**

Run: `npx tsx src/main.ts`
Expected: Images split into `output/` folder, logs written to `logs/`, same filenames as before

- [ ] **Step 3: Delete old files**

```bash
rm split.js error.log success.log
```

- [ ] **Step 4: Verify npm start still works**

Run: `npm start`
Expected: Script runs via `tsx src/main.ts`

- [ ] **Step 5: Commit**

```bash
git rm split.js error.log success.log
git commit -m "chore: remove old split.js and legacy log files"
```
