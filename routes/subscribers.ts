
import { Hono } from "hono";
import { z } from "zod";

const subscribers = new Hono();
import prisma from "../src/config";

const SubscriberSchema = z.object({
    email: z.string().email("Invalid email format"),
}); 

subscribers.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const parsedBody = SubscriberSchema.parse(body);

        let subscriber = await prisma.subscriber.create({
            data: {
                email: parsedBody.email,
            },
        });

        return c.json({ subscriber }, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, errors: error.errors }, 400);
        }
        return c.json({ success: false, message: "An unexpected error occurred" }, 500);
    }
}); 

subscribers.get("/", async (c) => {
    try {
        let subscribers = await prisma.subscriber.findMany();
        return c.json(subscribers);
    } catch (error) {
        return c.json({ success: false, message: "An error occurred while fetching subscribers" }, 500);
    }
});

subscribers.delete("/", async (c) => {
    const body = await c.req.json();
    try {
        await prisma.subscriber.delete({
            where: { email: body.email },
        });
        return c.json({ message: "Subscriber deleted" }, 200);
    } catch (error) {
        return c.json({ success: false, message: "An error occurred while deleting the subscriber" }, 500);
    }
});