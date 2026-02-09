import prisma, { Prisma } from "../../core/db";
import type { NewPost } from "./validation";
import { HTTPException } from 'hono/http-exception'


export async function getAllPosts() {
  return prisma.post.findMany();
}

export async function getPostById(id: number) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new HTTPException(404, { message: "Post not found"});
  }
  return post;
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
  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    throw new HTTPException(404, { message: "Post not found" });
  }
  if (existingPost.authorId !== authorId) {
    throw new HTTPException(403, { message: "You do not have permission to update this post" });
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
  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    throw new HTTPException(404, { message: "Post not found"});
  }
  if (existingPost.authorId !== authorId) {
    throw new HTTPException(403, { message: "You do not have permission to delete this post"});
  }
  return prisma.post.delete({ where: { id } });
}
