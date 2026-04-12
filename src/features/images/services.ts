import prisma from "../../core/db";
import { HTTPException } from "hono/http-exception";
import type { NewUploadedImage, UpdateImage } from "./validation";
import {
  deleteStoredImage,
  storeUploadedImage,
} from "./upload/storage";

export async function getAllImages() {
  return prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getImageById(id: string) {
  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) {
    throw new HTTPException(404, { message: "Image not found" });
  }
  return image;
}

export async function createImageFromUpload(
  file: File,
  data: NewUploadedImage
) {
  const storedImage = await storeUploadedImage(file);

  try {
    return await prisma.image.create({
      data: {
        ...data,
        ...storedImage,
      },
    });
  } catch (error) {
    await deleteStoredImage(storedImage.path);
    throw error;
  }
}

export async function updateImageFromUpload(
  id: string,
  input: { file?: File; data: UpdateImage }
) {
  const existingImage = await prisma.image.findUnique({ where: { id } });
  if (!existingImage) {
    throw new HTTPException(404, { message: "Image not found" });
  }

  const storedImage = input.file ? await storeUploadedImage(input.file) : null;

  try {
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        ...input.data,
        ...(storedImage ?? {}),
      },
    });

    if (storedImage) {
      await deleteStoredImage(existingImage.path);
    }

    return updatedImage;
  } catch (error) {
    if (storedImage) {
      await deleteStoredImage(storedImage.path);
    }

    throw error;
  }
}

export async function deleteImage(id: string) {
  const existingImage = await prisma.image.findUnique({ where: { id } });
  if (!existingImage) {
    throw new HTTPException(404, { message: "Image not found" });
  }

  const deletedImage = await prisma.image.delete({ where: { id } });
  await deleteStoredImage(existingImage.path);
  return deletedImage;
}
