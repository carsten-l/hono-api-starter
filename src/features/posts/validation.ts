import { z } from 'zod'
export const postSchema = z.object({
  id: z.number().optional(),
  title: z.string( { 
    error: (iss) => iss.input === undefined ? "Title is required." : "Invalid input."
  }).min(1, "Title cannot be empty."),
  content: z.string({ 
    error: (iss) => iss.input === undefined ? "Content is required." : "Invalid input."
  }).min(1, "Content cannot be empty."),
  published: z.boolean().optional(),
  authorId: z.number().min(1)
});
export type Post = z.infer<typeof postSchema>;
export type NewPost = Omit<Post, 'id' | "authorId"> ;