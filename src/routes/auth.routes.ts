import { Hono } from "hono";
import { z } from "zod";
import { createUserController, loginUserController } from "../controllers/auth.controller";

const auth = new Hono();

auth.post("/register", async (c) => {
    try {
        const body = await c.req.json();
        const user = await createUserController(body);
        return c.json({ user }, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, errors: error.errors }, 400);
        }
        return c.json({ success: false, message: "An unexpected error occurred" }, 500);
    }
});

auth.post("/login", async (c) => {
    try {
        const body = await c.req.json();
        const user = loginUserController(body)
        return c.json({ user }, 200);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, errors: error.errors }, 400);
        }
        return c.json({ success: false, message: "An unexpected error occurred" }, 500);
    }
});

export default auth;