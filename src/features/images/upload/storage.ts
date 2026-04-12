import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { HTTPException } from "hono/http-exception";
import { imageSize } from "image-size";
import { ALLOWED_IMAGE_FORMATS } from "./formats";
import { validateUploadType } from "./validateUploadType";

const FILE_BUCKET_DIRECTORY = path.join(process.cwd(), "public", "file-bucket");
const FILE_BUCKET_PUBLIC_PREFIX = "/file-bucket/";

export type StoredImageFile = {
  path: string;
  width: number;
  height: number;
};

export async function storeUploadedImage(file: File): Promise<StoredImageFile> {
  if (file.size === 0) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: { file: ["Uploaded file is empty."] },
    });
  }

  const originalName = file.name || "upload.bin";
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const detectedFormat = validateUploadType(file, fileBuffer);
  const dimensions = imageSize(fileBuffer);

  if (!dimensions.width || !dimensions.height) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: { file: ["Could not determine image width and height."] },
    });
  }

  await mkdir(FILE_BUCKET_DIRECTORY, { recursive: true });

  const extension =
    path.extname(originalName).toLowerCase() ||
    ALLOWED_IMAGE_FORMATS[detectedFormat].extensions[0];
  const filename = `${randomUUID()}${extension}`;
  const diskPath = path.join(FILE_BUCKET_DIRECTORY, filename);
  const storedPath = `${FILE_BUCKET_PUBLIC_PREFIX}${filename}`;

  await writeFile(diskPath, fileBuffer);

  return {
    path: storedPath,
    width: dimensions.width,
    height: dimensions.height,
  };
}

export async function deleteStoredImage(storedPath: string) {
  if (!storedPath.startsWith(FILE_BUCKET_PUBLIC_PREFIX)) {
    return;
  }

  const filename = path.basename(storedPath);
  const diskPath = path.join(FILE_BUCKET_DIRECTORY, filename);
  await rm(diskPath, { force: true });
}
