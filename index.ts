
import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import posts from "./routes/posts";
import auth from "./routes/auth";
import users from "./routes/users";

const app = new Hono();
app.use("*", cors());
app.use("*", logger());


app.route("auth", auth);
app.route("users", users);
app.route("posts", posts);



serve({
    fetch: app.fetch,
    port: 4000,
    hostname: "localhost",
})