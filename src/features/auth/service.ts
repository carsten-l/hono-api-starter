import type { NewUser, LoginUser } from "../users/validation";
import prisma, { Prisma } from "../../core/db";
import { HTTPException } from 'hono/http-exception'
import { hashSync, compareSync } from "bcryptjs";
import { sign } from "hono/jwt";


    export async function createUser (userData: NewUser) {
        const user = await prisma.user.create({ data: {
            name: userData.name,
            email: userData.email,
            password: hashSync(userData.password, 15)
        }});
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    export async function loginUser (body: LoginUser) {
        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (!user || !compareSync(body.password, user.password)) {
            throw new HTTPException(401, {
                message: "Invalid credentials",
                cause: { formErrors: ["Invalid email or password"] } // optional, frontend-friendly
            });
        }

        const accessToken = await sign(
            { id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
            process.env.JWT_SECRET as string
        );

        
        return {
            id: user.id,
            name: user.name,
            accessToken,
            validUntil: Date.now() + (60 * 60 * 1000)
        };
       
    }

