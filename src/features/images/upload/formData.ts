import { HTTPException } from "hono/http-exception";
import { flattenError } from "zod";
import {
  createUploadImageSchema,
  updateImageSchema,
  type NewUploadedImage,
  type UpdateImage,
} from "../validation";

export type ParsedCreateImageUpload = {
  file: File;
  data: NewUploadedImage;
};

export type ParsedUpdateImageUpload = {
  file?: File;
  data: UpdateImage;
};

function getOptionalFile(formData: FormData) {
  const fileField = formData.get("file");

  if (fileField === null) {
    return undefined;
  }

  if (!(fileField instanceof File)) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: { file: ["File must be a valid upload."] },
    });
  }

  return fileField;
}

export function parseCreateImageUpload(formData: FormData): ParsedCreateImageUpload {
  const file = getOptionalFile(formData);
  if (!file) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: { file: ["File is required."] },
    });
  }

  const result = createUploadImageSchema.safeParse({
    altText: String(formData.get("altText") ?? "").trim(),
  });

  if (!result.success) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: flattenError(result.error),
    });
  }

  return { file, data: result.data };
}

export function parseUpdateImageUpload(formData: FormData): ParsedUpdateImageUpload {
  const file = getOptionalFile(formData);
  const altTextRaw = formData.get("altText");
  const input = {
    altText:
      altTextRaw === null ? undefined : String(altTextRaw).trim(),
  };

  const result = updateImageSchema.safeParse(input);
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: flattenError(result.error),
    });
  }

  if (!file && result.data.altText === undefined) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: {
        form: ["Provide at least one of file or altText."],
      },
    });
  }

  return {
    file,
    data: result.data,
  };
}
