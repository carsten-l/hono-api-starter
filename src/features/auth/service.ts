import type { NewUser, LoginUser } from "../users/validation";
import prisma, { Prisma } from "../../core/db";
import { hashSync, compareSync } from "bcryptjs";
import { sign } from "hono/jwt";


    export async function createUser (userData: NewUser) {
        const prismaData: Prisma.UserCreateInput = {
            name: userData.name,
            email: userData.email,
            password: hashSync(userData.password, 15)
        }
        const user = await prisma.user.create({ data:prismaData });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    export async function loginUser (body: LoginUser) {
        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (user && compareSync(body.password, user.password)) {
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

