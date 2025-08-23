import type { RegisterUser } from "../types";
import prisma, { Prisma } from "../config";
import { hashSync, compareSync } from "bcryptjs";
import { sign } from "hono/jwt";

export const authService = {
    register: async (userData: RegisterUser) => {
        const prismaData: Prisma.UserCreateInput = {
            name: userData.name,
            email: userData.email,
            password: hashSync(userData.password, 15)
        }
        const user = await prisma.user.create({ data:prismaData });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    login: async (email: string, password: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && compareSync(password, user.password)) {
            let accessToken = await sign({
                id: user.id,
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
            }, process.env.JWT_SECRET as string
            );
            return {
                id: user.id,
                name: user.name,
                accessToken,
                validUntil: Date.now() + (60 * 60 * 1000)
            };
        } else {
            throw new Error("Invalid credentials");
        }
    }
};
