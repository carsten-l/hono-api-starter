import { Hono } from "hono";
import { z } from "zod"; // <-- needed to detect ZodError
import {
  createSubscriberController,
  getSubscribersController,
  deleteSubscriberController,
} from "../controllers/subscribers.controller";

const subscribers = new Hono();

subscribers.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const subscriber = await createSubscriberController(body);
    return c.json({ subscriber }, 201);

  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ success: false, errors: err.errors }, 400);
    }
    return c.json({ success: false, message: "Unexpected error" }, 500);
  }
});

subscribers.get("/", async (c) => {
  try {
    const list = await getSubscribersController();
    return c.json(list);

  } catch (err) {
    return c.json({ success: false, message: "Error fetching subscribers" }, 500);
  }
});

subscribers.delete("/", async (c) => {
  try {
    const body = await c.req.json();
    await deleteSubscriberController(body);
    return c.json({ message: "Subscriber deleted" }, 200);

  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ success: false, errors: err.errors }, 400);
    }
    return c.json({ success: false, message: "Unexpected error" }, 500);
  }
});

export default subscribers;
