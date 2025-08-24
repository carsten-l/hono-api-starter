import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { subscriberSchema } from "./validation";
import {
  createSubscriber,
  getAllSubscribers,
  deleteSubscriber
} from "./services";

const subscribers = new Hono();

subscribers.get("/", async (c) => {
    const list = await getAllSubscribers();
    return c.json(list);

});

subscribers.post("/", 
  zValidator('json', subscriberSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
  }), 
  async (c) => {
    const body = c.req.valid("json");
    const subscriber = await createSubscriber(body.email);
    return c.json({ subscriber }, 201);
  }
);


subscribers.delete("/", async (c) => {
    const body = await c.req.json();
    await deleteSubscriber(body.email);
    return c.json({ message: "Subscriber deleted" }, 200);
  });

export default subscribers;
