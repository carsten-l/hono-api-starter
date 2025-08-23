import { Hono } from "hono";
import { z } from "zod";
import type { NewUser, LoginUser } from "../schemas";
import { createUser, loginUser } from "../controllers/auth.controller";
import { userSchema } from "../schemas";

const auth = new Hono();

auth.post("/register", async (c) => {
    try {
        const body: NewUser = await c.req.json();
        const parsedBody = userSchema.parse(body); // Validate input
        const result = await createUser(parsedBody);
        // Remove password from the response
        return c.json({user: result.user}, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, errors: error.errors }, 400);
        }
        return c.json({ success: false, message: "An unexpected error occurred" }, 500);
    }
});

auth.post("/login", async (c) => {
    try {
        const body: LoginUser = await c.req.json();
        const parsedBody = userSchema.parse(body); // Validate input
        const result = await loginUser(parsedBody);
        return c.json({ user: result.user }, 200);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, errors: error.errors }, 400);
        }
        return c.json({ success: false, message: "An unexpected error occurred" }, 500);
    }
});

export default auth;