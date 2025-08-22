import { Hono } from "hono";
import { jwt } from 'hono/jwt'
import { getUserById, updateUser } from "../controllers/users.controller";

const users = new Hono();

users.use("/*", jwt({
    secret: process.env.JWT_SECRET as string,
}));

users.get("/me", async (c) => {
    const payload = c.get("jwtPayload");
    if (!payload) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const user = await getUserById(payload.id);
    if (user) {
        return c.json(user);
    } else {
        return c.json({ message: "User not found" }, 404);
    }
});

users.patch("/me", async (c) => {
    const payload = c.get("jwtPayload");
    if (!payload) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const body = await c.req.json();
    const user = await updateUser(payload.id, body);
    return c.json(user);
});


export default users;