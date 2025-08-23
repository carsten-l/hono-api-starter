import { Hono } from "hono";
import { z } from "zod";
import { hashSync, compareSync } from "bcryptjs";
import type { RegisterUser } from "../types";
import { createUser, loginUser } from "../controllers/auth.controller";

const auth = new Hono();

const userSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(8),
});

auth.post("/register", async (c) => {
    try {
        const body: RegisterUser = await c.req.json();
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
        const body: RegisterUser = await c.req.json();
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