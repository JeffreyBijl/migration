# Image Split — TypeScript Conversion & Test Design

## Goal

Convert the existing `split.js` script to TypeScript, improve structure by separating pure logic from I/O, add concurrency control, and write Vitest tests for the logic layer. Output (files, filenames, Dutch log messages) remains identical. Log ordering may differ due to chunked concurrency.

## File Structure

```
src/
  config.ts          # Config type + defaults
  split.ts           # Pure logic functions (testable)
  main.ts            # Orchestration, I/O, sharp calls, logging
  __tests__/
    split.test.ts    # Vitest tests for pure functions
```

`split.js` is removed after conversion.

## Config (`src/config.ts`)

```typescript
interface Config {
  folderPath: string;      // default: "./img"
  outputFolder: string;    // default: "./output"
  logsFolder: string;      // default: "./logs"
  thumbnailSize: number;   // default: 150
  targetPPI: number;       // default: 72
  concurrency: number;     // default: 10
}
```

Exported as `defaultConfig` with the defaults above. All functions receive config as a parameter — no global state.

## Pure Functions (`src/split.ts`)

### `calculateDimensions(width, height, density, targetPPI)`

Parameters are the original image metadata dimensions. `density` defaults to `targetPPI` when missing from metadata (always a positive number).

Returns `{ newWidth, newHeight, halfWidth, leftHalfWidth, rightHalfWidth }`.

Formula:
1. `widthInches = width / density`
2. `heightInches = height / density`
3. `newWidth = Math.round(widthInches * targetPPI)`
4. `newHeight = Math.round(heightInches * targetPPI)`
5. If `newWidth < width`, reset **both** `newWidth = width` and `newHeight = height` (coupled revert)
6. Clamp: `newWidth = Math.max(newWidth, 2)`, `newHeight = Math.max(newHeight, 2)`
7. `halfWidth = Math.max(Math.floor(newWidth / 2), 1)`
8. `leftHalfWidth = Math.min(halfWidth, newWidth)`
9. `rightHalfWidth = Math.min(halfWidth, newWidth - halfWidth)`

Steps 8-9 handle odd-width images where `newWidth - halfWidth` differs from `halfWidth`.

### `calculateThumbnailDimensions(thumbnailSize)`

Returns `{ thumbnailSize, halfThumbnailSize, leftThumbnailWidth, rightThumbnailWidth }`.

- `halfThumbnailSize = Math.max(Math.floor(thumbnailSize / 2), 1)`
- `leftThumbnailWidth = Math.min(halfThumbnailSize, thumbnailSize)`
- `rightThumbnailWidth = Math.min(halfThumbnailSize, thumbnailSize - halfThumbnailSize)`

Note: thumbnails are created by resizing to fit within a `thumbnailSize` box (single argument to `sharp.resize()`, preserving aspect ratio), then extracting left/right halves with `height: thumbnailSize`.

### `generateOutputPaths(filePath, outputFolder)`

Returns `{ leftFile, rightFile, leftThumbnailFile, rightThumbnailFile }`.

- Uses only the **basename** of `filePath` (directory portion is discarded)
- Removes `.jpg` extension via `path.basename(filePath, ".jpg")`
- Joins with `outputFolder` to produce:
  - `{outputFolder}/{basename}-left.jpg`
  - `{outputFolder}/{basename}-right.jpg`
  - `{outputFolder}/{basename}-thumbnail-left.jpg`
  - `{outputFolder}/{basename}-thumbnail-right.jpg`

## Orchestration (`src/main.ts`)

### `splitImage(filePath, config)`

- Creates sharp instance with `.withMetadata()` on initial load (preserves ICC profiles, EXIF orientation)
- Calls pure functions for calculations
- Validates all dimensions are > 0 before extraction, throws `"Ongeldige afmetingen berekend voor extractie"` if not
- Uses sharp to resize, extract, and write the 4 output files
- Main halves: `.withMetadata({ density: targetPPI })` on output
- Sharp thumbnail pipeline: `.resize(thumbnailSize)` (single arg, preserves aspect ratio) then `.extract()`
- Console output preserved: logs processing info, dimensions, and extraction dimensions per file
- Returns `{ success: boolean, filePath, error?: string, extraInfo?: string }`
- `extraInfo` is populated only for "bad extract area" errors, containing: `originele breedte`, `hoogte`, `dichtheid`, `berekende nieuwe breedte`, `hoogte`, `halfWidth`, `leftHalfWidth`, `rightHalfWidth`

### `processFolder(config)`

- Creates `outputFolder` and `logsFolder` directories with `{ recursive: true }`
- Reads directory, filters `.jpg` files (case-insensitive: matches `.JPG`, `.Jpg`, etc.)
- Processes with concurrency limit via chunk helper
- Collects results, writes error/success logs to `logs/` with timestamped filenames
- Dutch log messages preserved exactly:
  - Success: `{datetime} - Splitsen van {filePath} gelukt - Left: {leftFile}, Right: {rightFile}`
  - Error: `{datetime} - Fout bij het splitsen van de afbeelding {filePath}: {error}{extraInfo}`
  - Folder error: `{datetime} - Er is een fout opgetreden bij het verwerken van de map: {error}`

## Concurrency

A simple `processWithConcurrency(items, fn, limit)` helper that processes items in chunks of `config.concurrency` (default 10) using `Promise.all` per chunk. No external dependency needed. Each item handles its own errors via try/catch inside `splitImage` — a failing item does not affect other items in the chunk. Note: log entry ordering may differ from the current unbounded-parallel implementation.

## Tests (`src/__tests__/split.test.ts`)

Pure logic tests only — no sharp, no file I/O.

### `calculateDimensions`

- Identity case: density equals targetPPI (e.g., 1000x800, density 72, targetPPI 72) → preserves original dimensions
- Higher density (e.g., 300 PPI, targetPPI 72) → scales down but coupled revert keeps originals since newWidth < width
- Lower density (e.g., 36 PPI, targetPPI 72) → upscales, newWidth > original so no revert
- Odd width (e.g., 1001) → halfWidth = 500, leftHalfWidth = 500, rightHalfWidth = 500 (right side capped by Math.min)
- Minimum clamping → width >= 2, height >= 2, halfWidth >= 1

### `calculateThumbnailDimensions`

- Default (150) → `{ thumbnailSize: 150, halfThumbnailSize: 75, leftThumbnailWidth: 75, rightThumbnailWidth: 75 }`
- Odd number (151) → halfThumbnailSize: 75, leftThumbnailWidth: 75, rightThumbnailWidth: 75 (capped by Math.min)
- Minimum (1) → halfThumbnailSize: 1, handles edge case

### `generateOutputPaths`

- Normal filename → correct `-left.jpg`, `-right.jpg`, `-thumbnail-left.jpg`, `-thumbnail-right.jpg`
- Path with directory → only basename used, directory discarded
- Filename with `.jpg` in middle (e.g., `photo.jpg.backup.jpg`) → `path.basename` strips only trailing `.jpg`

## Project Configuration

- `tsconfig.json`: ESM output, strict mode
- `vitest.config.ts`: minimal config
- `package.json`: keeps `sharp` as production dependency, adds `typescript`, `tsx`, `vitest`, `@types/node` as devDependencies
- Start script: `tsx src/main.ts`
- Test script: `vitest run`
