import * as path from "node:path";

export const FILE_EXTENSION = ".jpg";

interface HalfSplit {
  half: number;
  rightHalf: number;
}

function splitHalf(total: number): HalfSplit {
  const half = Math.max(Math.floor(total / 2), 1);
  const rightHalf = Math.min(half, total - half);
  return { half, rightHalf };
}

export interface Dimensions {
  newWidth: number;
  newHeight: number;
  halfWidth: number;
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

  const { half: halfWidth, rightHalf: rightHalfWidth } = splitHalf(newWidth);

  return { newWidth, newHeight, halfWidth, rightHalfWidth };
}

export interface ThumbnailDimensions {
  thumbnailSize: number;
  halfThumbnailSize: number;
  rightThumbnailWidth: number;
}

export function calculateThumbnailDimensions(
  thumbnailSize: number
): ThumbnailDimensions {
  const { half: halfThumbnailSize, rightHalf: rightThumbnailWidth } = splitHalf(thumbnailSize);
  return { thumbnailSize, halfThumbnailSize, rightThumbnailWidth };
}

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
  const basename = path.basename(filePath, FILE_EXTENSION);

  return {
    leftFile: path.join(outputFolder, `${basename}.FS2D.cadLeft${FILE_EXTENSION}`),
    rightFile: path.join(outputFolder, `${basename}.FS2D.cadRight${FILE_EXTENSION}`),
    leftThumbnailFile: path.join(outputFolder, `${basename}.FS2D.thumbLeft${FILE_EXTENSION}`),
    rightThumbnailFile: path.join(outputFolder, `${basename}.FS2D.thumbRight${FILE_EXTENSION}`),
  };
}
