import { z } from "zod";

export const userSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export type User = z.infer<typeof userSchema>;
export type NewUser = Omit<User, 'id'>;
export type LoginUser = Pick<User, 'email' | 'password'>;


