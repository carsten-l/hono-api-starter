import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception'
import posts from "./features/posts/api";
import message from './features/messages/api';
import auth from "./features/auth/api";
import users from "./features/users/api";
import subscribers from './features/subscribers/api';

const app = new Hono();
app.use("*", cors());
app.use("*", logger());

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    const cause = (error as any).cause
    console.error(`HTTPException: ${error.message}`, cause);
    return c.json(
      {
        message: error.message,
        ...(cause && { errors: cause }), // already frontend-friendly
      },
      error.status
    )
  }

  return c.json({ message: 'Internal Server Error' }, 500)
})


app.route("auth", auth);
app.route("users", users);
app.route("posts", posts);
app.route("subscribers", subscribers);
app.route("contact-us", message);




export default app;