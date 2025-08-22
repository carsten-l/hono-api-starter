
import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import posts from "./src/routes/posts.routes";
import auth from "./src/routes/auth.routes";
import users from "./src/routes/users.routes";
import subscribers from './src/routes/subscribers.routes';

const app = new Hono();
app.use("*", cors());
app.use("*", logger());


app.route("auth", auth);
app.route("users", users);
app.route("posts", posts);
app.route("subscribers", subscribers);

serve({
    fetch: app.fetch,
    port: 4000,
    hostname: "localhost",
})