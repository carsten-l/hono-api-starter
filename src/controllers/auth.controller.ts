import { z } from "zod";
import { Prisma } from "../config";
import { authService } from "../services/auth.service";

const userSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(8),
});


export async function createUser(body: Prisma.UserCreateInput) {
    const parsed = userSchema.parse(body);
    const user = await authService.register(parsed);
    return { user };
}

export async function loginUser(body: Prisma.UserCreateInput) {
    const parsed = userSchema.pick({ email: true, password: true }).parse(body);
    const user = await authService.login(parsed.email, parsed.password);
    return { user };
}