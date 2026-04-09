import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { messageSchema } from "./validation";
import { getAllMessages, createMessage } from "./services";

const messages = new Hono();

const validateMessage = zValidator("json", messageSchema, (result, c) => {
    if (!result.success) {
        return c.json({ error: result.error }, 400);
    }
});

messages.get("/", async (c) => {
    const messagesList = await getAllMessages();
    return c.json(messagesList);
});

messages.post("/", validateMessage, async (c) => {
    const body = await c.req.valid("json");
    const result = await createMessage(body);
    return c.json({ result }, 201);
});

export default messages;