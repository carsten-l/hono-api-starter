import prisma, { Prisma } from "../../core/db";
import type { NewPost } from "./validation";


export async function getAllPosts() {
  return prisma.post.findMany();
}

export async function getPostById(id: number) {
  return prisma.post.findUnique({ where: { id } });
}

export async function createPost (data: NewPost, authorId: number) {
  return prisma.post.create({ 
    data: {
      ...data,
      author: { connect: { id: authorId }}
    } 
  });
}

export async function updatePost(id: number, data: NewPost, authorId: number) {
  const existingPost = await getPostById(id);
  if (!existingPost) {
    throw new Error("Post not found");
  }
  if (existingPost.authorId !== authorId) {
    throw new Error("Unauthorized");
  }
  return prisma.post.update({ 
    where: { id }, 
    data: {
      ...data,
      author: { connect: { id: authorId }}
    } 
  });
}

export async function deletePost(id: number, authorId: number) {
  const existingPost = await getPostById(id);
  if (!existingPost) {
    throw new Error("Post not found");
  }
  if (existingPost.authorId !== authorId) {
    throw new Error("Unauthorized");
  }
  return prisma.post.delete({ where: { id } });
}
