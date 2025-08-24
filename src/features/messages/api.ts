import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { messageSchema } from "./validation";
import { getAllMessages, createMessage } from "./services";

const messages = new Hono();

messages.post("/",
    zValidator("json", messageSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: result.error }, 400);
        }
    }),
    async (c) => {
        const body = await c.req.valid("json");
        const result = await createMessage(body);
        return c.json({ result }, 201);
    } 
);

messages.get("/", async (c) => {
    try {
        const messagesList = await getAllMessages();
        return c.json(messagesList);
    } catch (error) {
        return c.json({ success: false, message: "An error occurred while fetching messages" }, 500);
    }
});

export default messages;