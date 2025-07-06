import { Hono } from "hono";
import prisma from "../src/config";
import { jwt } from 'hono/jwt'
import { hashSync } from "bcryptjs";

const users = new Hono();

users.use("/*", jwt({
    secret: process.env.JWT_SECRET as string,
}));

users.get("/me", async (c) => {
    let payload = c.get("jwtPayload")

    if (payload) {
        let user = await prisma.user.findUnique({
            where: { id: payload.id },
        });
        if (user) {
            let { password, ...userWithoutPassword } = user;
            return c.json(userWithoutPassword);
        } else {
            return c.json({ message: "User not found" }, 404);
        }
    } else {
        return c.json({ message: "Unauthorized" }, 401);
    }
});

users.patch("/me", async (c) => {
    let payload = c.get("jwtPayload");

    if (payload) {
        const body = await c.req.json();
        let user = await prisma.user.update({
            where: { id: payload.id },
            data: {
                name: body.name,
                email: body.email,
                password: body.newPassword ? hashSync(body.newPassword, 15) : undefined,
            },
        });
        let { password, ...userWithoutPassword } = user;
        return c.json(userWithoutPassword);
    } else {
        return c.json({ message: "Unauthorized" }, 401);
    }
});


export default users;