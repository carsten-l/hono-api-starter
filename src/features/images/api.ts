import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { flattenError } from "zod";
import { HTTPException } from "hono/http-exception";
import { imageIdParamSchema } from "./validation";
import {
  createImageFromUpload,
  deleteImage,
  getAllImages,
  getImageById,
  updateImageFromUpload,
} from "./services";
import {
  parseCreateImageUpload,
  parseUpdateImageUpload,
} from "./upload/formData";

const images = new Hono();

const validateImageParams = zValidator("param", imageIdParamSchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: flattenError(result.error),
    });
  }
});

images.get("/", async (c) => {
  const list = await getAllImages();
  return c.json({
    data: list,
    meta: { count: list.length },
  });
});

images.get("/:id", validateImageParams, async (c) => {
  const { id } = c.req.valid("param");
  const image = await getImageById(id);
  return c.json({ data: image });
});

images.post("/upload", async (c) => {
  const upload = parseCreateImageUpload(await c.req.formData());
  const image = await createImageFromUpload(upload.file, upload.data);

  return c.json({ data: image }, 201);
});

images.put("/:id", validateImageParams, async (c) => {
  const { id } = c.req.valid("param");
  const upload = parseUpdateImageUpload(await c.req.formData());
  const image = await updateImageFromUpload(id, upload);
  return c.json({ data: image });
});

images.delete("/:id", validateImageParams, async (c) => {
  const { id } = c.req.valid("param");
  await deleteImage(id);
  return c.json({ message: "Image deleted" });
});

export default images;
