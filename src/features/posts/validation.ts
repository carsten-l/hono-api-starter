import { z } from 'zod'
export const postSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2).max(100),
  content: z.string().min(2).max(1000),
  published: z.boolean().optional(),
  authorId: z.number().min(1)
});
export type Post = z.infer<typeof postSchema>;
export type NewPost = Omit<Post, 'id' | "authorId"> ;