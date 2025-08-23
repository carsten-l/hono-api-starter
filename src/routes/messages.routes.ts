import { Hono } from "hono";
import { z } from "zod";
import { createMessageController, getMessagesController } from "../controllers/messages.controller";
const messages = new Hono();


messages.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const result = await createMessageController(body);
        return c.json({ result }, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, errors: error.errors }, 400);
        }
        return c.json({ success: false, message: "An unexpected error occurred" }, 500);
    }
});

messages.get("/", async (c) => {
    try {
        const messagesList = await getMessagesController();
        return c.json(messagesList);
    } catch (error) {
        return c.json({ success: false, message: "An error occurred while fetching messages" }, 500);
    }
});

export default messages;