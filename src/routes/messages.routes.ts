import { Hono } from "hono";
import { z } from "zod";
import { createMessage, getMessages } from "../controllers/messages.controller";

const messages = new Hono();

const MessageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
});

messages.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const parsedBody = MessageSchema.parse(body);
        const result = await createMessage(parsedBody);
        return c.json({ message: result.message }, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, errors: error.errors }, 400);
        }
        return c.json({ success: false, message: "An unexpected error occurred" }, 500);
    }
});

messages.get("/", async (c) => {
    try {
        const messagesList = await getMessages();
        return c.json(messagesList);
    } catch (error) {
        return c.json({ success: false, message: "An error occurred while fetching messages" }, 500);
    }
});

export default messages;