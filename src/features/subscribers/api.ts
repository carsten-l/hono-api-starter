import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { subscriberSchema } from "./validation";
import {
  createSubscriber,
  getAllSubscribers,
  deleteSubscriber
} from "./services";
import { success } from "zod";

const subscribers = new Hono();

const validatesubscriber = zValidator('json', subscriberSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
  });

subscribers.get("/", async (c) => {
    const list = await getAllSubscribers();
    return c.json({ 
      data: list,
      meta: { count: list.length }
    }); 
});

subscribers.post("/", validatesubscriber, async (c) => {
  const body = c.req.valid("json");
  const subscriber = await createSubscriber(body.email);
  return c.json({ data: subscriber }, 201);
});


subscribers.delete("/", async (c) => {
  const body = await c.req.json();
  await deleteSubscriber(body.email);
  return c.status(204);
});

export default subscribers;
