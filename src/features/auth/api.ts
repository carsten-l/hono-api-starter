import { Hono } from "hono";
import { z, flattenError } from "zod";
import { HTTPException } from 'hono/http-exception'
import { createUser, loginUser } from "./service";
import { userSchema } from "../users/validation";
import { zValidator } from "@hono/zod-validator";

const auth = new Hono();

auth.post("/register", 
    zValidator("json", userSchema.pick({ name: true, email: true, password: true }), (result, c) => {
        if (!result.success) {
            throw new HTTPException(400, {
                  message: 'Validation failed',
                  cause: flattenError(result.error),
                })
        }
    }), 
    async (c) => {
        const body = await c.req.valid("json");
        const user = await createUser(body);
        return c.json({ user }, 201);
   
});

auth.post("/login", 
    zValidator("json", userSchema.pick({ email: true, password: true }), (result, c) => {
        if (!result.success) {
            throw new HTTPException(400, {
                    message: 'Validation failed',
                    cause: flattenError(result.error),
                  })        
        }
    }), 
    async (c) => {
        const body = await c.req.valid("json");
        const user = await loginUser(body);
        return c.json({ user }, 200);
    }
);

export default auth;