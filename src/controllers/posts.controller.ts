import prisma, { Prisma } from "../config";
import { z } from "zod";
import { postsService } from "../services/posts.service";
import auth from "../routes/auth.routes";
import type { NewPost } from "../types";

const postSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().min(2).max(1000),
  published: z.boolean().optional(),
  authorId: z.number().min(1)
});

export async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}

export async function getPostById(id: number) {
  const post = await prisma.post.findUnique({ where: { id } });
  return post;
}

export async function createPost(body: NewPost) {
    const parsed = postSchema.parse(body);
    return postsService.create(parsed);
}

export async function updatePost(id: number, body: NewPost) {
  const parsed = postSchema.parse(body);
  return postsService.update(id, parsed);
}
export async function deletePost(id: number) {
  return postsService.delete(id);
}