
import { Hono } from "hono";
import prisma from "../src/config";
import { hashSync, compareSync } from "bcryptjs";
import { sign } from "hono/jwt";
import type { LoginUser } from "../src/types";

const auth = new Hono();

auth.post("/register", async (c) => {
    const body = await c.req.json();
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashSync(body.password, 15)
        },
    });
    // Remove password from the response
    let { password, ...userWithoutPassword } = user;
    return c.json(userWithoutPassword, 201);
});

auth.post("/login", async (c) => {
    const body: LoginUser = await c.req.json();
    const user = await prisma.user.findUnique({
        where: { email: body.email },
    });

    
    if (user && compareSync(body.password, user.password)) {
        let accessToken = await sign({
            id: user.id, 
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        }, process.env.JWT_SECRET as string
    );
        return c.json({ 
            id: user.id, 
            name: user.name,
            accessToken, 
            validUntil: Date.now() + (60*60*1000) 
        }, 200);
    } else {
        return c.json({ message: "Invalid credentials" }, 401);
    }
});

export default auth;