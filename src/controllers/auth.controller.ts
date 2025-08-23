import { z } from "zod";
import { Prisma } from "../config";
import { authService } from "../services/auth.service";
import { userSchema  } from "../schemas";

export async function createUserController(body: Prisma.UserCreateInput) {
    const parsed = userSchema.parse(body);
    const user = await authService.register(parsed);
    return { user };
}

export async function loginUserController(body: Prisma.UserCreateInput) {
    const parsed = userSchema.pick({ email: true, password: true }).parse(body);
    const user = await authService.login(parsed);
    return { user };
}