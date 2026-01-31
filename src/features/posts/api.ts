
import { Hono } from "hono";
import { z } from "zod"; // <-- needed to detect ZodError
import { jwt } from 'hono/jwt'
import { zValidator } from "@hono/zod-validator";
import { postSchema, type NewPost } from "./validation";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "./services";

const posts = new Hono();

// Middleware to validate request body against postSchema
const validatePost = zValidator("json", postSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
  });

posts.get("/", async (c) => {
    let posts = await getAllPosts();
    return c.json(posts);
});

posts.get("/:id", async (c) => {
        const id = c.req.param("id");
        let post = await getPostById(Number(id));
        return c.json(post);
});

posts.use("/*", jwt({
    secret: process.env.JWT_SECRET as string,
}));

posts.post("/", validatePost, async (c) => {
  const authorId = c.get("jwtPayload").id;
  const body: NewPost = await c.req.valid("json");
  const post = await createPost(body, authorId);
  return c.json(post);
  
});

posts.put("/:id", validatePost, async (c) => {
  const id = c.req.param("id"); // Get post ID from URL parameter
  const authorId = c.get("jwtPayload").id; // Get authorId from JWT payload
  const body = await c.req.valid("json");
  let post = await updatePost(Number(id), body, authorId);
  return c.json(post);
});

posts.delete("/:id", async (c) => {
  const id = c.req.param("id"); // Get post ID from URL parameter
  const authorId = c.get("jwtPayload").id; // Get authorId from JWT payload
  await deletePost(Number(id), authorId);
  return c.json({ message: "Post deleted" });
});

export default posts;