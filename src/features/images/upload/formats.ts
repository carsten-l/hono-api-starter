export const ALLOWED_IMAGE_FORMATS = {
  jpeg: {
    mimes: ["image/jpeg"],
    extensions: [".jpg", ".jpeg"],
  },
  png: {
    mimes: ["image/png"],
    extensions: [".png"],
  },
  webp: {
    mimes: ["image/webp"],
    extensions: [".webp"],
  },
  gif: {
    mimes: ["image/gif"],
    extensions: [".gif"],
  },
} as const;

export type SupportedImageFormat = keyof typeof ALLOWED_IMAGE_FORMATS;
