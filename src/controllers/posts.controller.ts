import prisma, { Prisma } from "../config";
import { postsService } from "../services/posts.service";
import { postSchema } from "../schemas";
import type { NewPost } from "../schemas";


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