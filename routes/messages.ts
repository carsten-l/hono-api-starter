
import { Hono } from "hono";
import { z } from "zod";
import prisma from "../src/config";

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
        
        let message = await prisma.message.create({
            data: {
                name: parsedBody.name,
                email: parsedBody.email,
                subject: parsedBody.subject,
                message: parsedBody.message,
            },
        }); 

            return c.json({ message }, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, errors: error.errors }, 400);
        }
        return c.json({ success: false, message: "An unexpected error occurred" }, 500);
    }
}); 

messages.get("/", async (c) => {
    try {
        let messages = await prisma.message.findMany();
        return c.json(messages);
    } catch (error) {
        return c.json({ success: false, message: "An error occurred while fetching messages" }, 500);
    }
}); 

export default messages;