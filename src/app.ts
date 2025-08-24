import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Hono } from "hono";
import posts from "./features/posts/api";
import message from './features/messages/api';
import auth from "./features/auth/api";
import users from "./features/users/api";
import subscribers from './features/subscribers/api';

const app = new Hono();
app.use("*", cors());
app.use("*", logger());


app.route("auth", auth);
app.route("users", users);
app.route("posts", posts);
app.route("subscribers", subscribers);
app.route("contact-us", message);

export default app;