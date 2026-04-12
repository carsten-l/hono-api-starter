import path from "node:path";
import { HTTPException } from "hono/http-exception";
import { ALLOWED_IMAGE_FORMATS, type SupportedImageFormat } from "./formats";

function detectImageFormatFromBuffer(
  fileBuffer: Buffer
): SupportedImageFormat | null {
  if (
    fileBuffer.length >= 3 &&
    fileBuffer[0] === 0xff &&
    fileBuffer[1] === 0xd8 &&
    fileBuffer[2] === 0xff
  ) {
    return "jpeg";
  }

  if (
    fileBuffer.length >= 8 &&
    fileBuffer[0] === 0x89 &&
    fileBuffer[1] === 0x50 &&
    fileBuffer[2] === 0x4e &&
    fileBuffer[3] === 0x47 &&
    fileBuffer[4] === 0x0d &&
    fileBuffer[5] === 0x0a &&
    fileBuffer[6] === 0x1a &&
    fileBuffer[7] === 0x0a
  ) {
    return "png";
  }

  if (
    fileBuffer.length >= 12 &&
    fileBuffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    fileBuffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }

  if (
    fileBuffer.length >= 6 &&
    ["GIF87a", "GIF89a"].includes(fileBuffer.subarray(0, 6).toString("ascii"))
  ) {
    return "gif";
  }

  return null;
}

export function validateUploadType(
  file: File,
  fileBuffer: Buffer
): SupportedImageFormat {
  const detectedFormat = detectImageFormatFromBuffer(fileBuffer);
  if (!detectedFormat) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: {
        file: [
          "Unsupported image format. Allowed formats are JPEG, PNG, WEBP, and GIF.",
        ],
      },
    });
  }

  const allowed = ALLOWED_IMAGE_FORMATS[detectedFormat];
  const allowedMimes: string[] = [...allowed.mimes];
  const allowedExtensions: string[] = [...allowed.extensions];
  const extension = path.extname(file.name || "").toLowerCase();
  const mimeType = (file.type || "").toLowerCase();

  if (mimeType && !allowedMimes.includes(mimeType)) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: {
        file: [
          `File content does not match MIME type '${mimeType}'. Expected ${allowedMimes.join(
            " or "
          )}.`,
        ],
      },
    });
  }

  if (extension && !allowedExtensions.includes(extension)) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: {
        file: [
          `File content does not match extension '${extension}'. Expected ${allowedExtensions.join(
            " or "
          )}.`,
        ],
      },
    });
  }

  return detectedFormat;
}
