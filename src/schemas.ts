import { z } from "zod";

export const userSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
});

export type User = z.infer<typeof userSchema>;
export type NewUser = Omit<User, 'id'>;
export type LoginUser = Pick<User, 'email' | 'password'>;

export const postSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2).max(100),
  content: z.string().min(2).max(1000),
  published: z.boolean().optional(),
  authorId: z.number().min(1)
});
export type Post = z.infer<typeof postSchema>;
export type NewPost = Omit<Post, 'id'>;

export const messageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const subscriberSchema = z.object({
  email: z.string().email("Invalid email format"),
});