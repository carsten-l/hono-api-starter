import { z } from "zod";

export const imageSchema = z.object({
  id: z.uuid().optional(),
  path: z.string().min(1, "Path is required."),
  altText: z.string().min(1, "Alt text is required."),
  width: z.number().int().positive("Width must be a positive integer."),
  height: z.number().int().positive("Height must be a positive integer."),
  createdAt: z.date().optional(),
});

export const createUploadImageSchema = z.object({
  altText: z.string().trim().min(1, "Alt text is required."),
});

export const updateImageSchema = z.object({
  altText: z.string().trim().min(1, "Alt text is required.").optional(),
});

export const imageIdParamSchema = z.object({
  id: z.uuid("Invalid image id. Expected UUID."),
});

export type Image = z.infer<typeof imageSchema>;
export type NewUploadedImage = z.infer<typeof createUploadImageSchema>;
export type UpdateImage = z.infer<typeof updateImageSchema>;
