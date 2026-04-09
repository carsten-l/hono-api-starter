
import { Hono } from "hono";
import { z, flattenError } from "zod"; // <-- needed to detect ZodError
import { jwt } from 'hono/jwt'
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from 'hono/http-exception'
import { postSchema, type NewPost } from "./validation";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "./services";
import { da } from "zod/v4/locales";

const posts = new Hono();

// Middleware to validate request body against postSchema
const validatePost = zValidator("json", postSchema.pick({ title: true, content: true }), (result, c) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: 'Validation failed',
      cause: flattenError(result.error),
    })
  }
});

posts.get("/", async (c) => {
    let posts = await getAllPosts();
    return c.json({
      data: posts,
      meta: { count: posts.length }
    });
});

posts.get("/:id", async (c) => {
        const id = c.req.param("id");
        let post = await getPostById(Number(id));
        return c.json({ data: post });
});

posts.use("/*", jwt({
    secret: process.env.JWT_SECRET as string,
    alg: 'HS256' // Specify the expected algorithm(s) for better security
}));

posts.post("/", validatePost, async (c) => {
  const authorId = c.get("jwtPayload").id;
  const body: NewPost = await c.req.valid("json");
  const post = await createPost(body, authorId);
  return c.json({ data: post }, 201);
  
});

posts.put("/:id", validatePost, async (c) => {
  const id = c.req.param("id"); // Get post ID from URL parameter
  const authorId = c.get("jwtPayload").id; // Get authorId from JWT payload
  const body = await c.req.valid("json");
  let post = await updatePost(Number(id), body, authorId);
  return c.json({ data: post });
});

posts.delete("/:id", async (c) => {
  const id = c.req.param("id"); // Get post ID from URL parameter
  const authorId = c.get("jwtPayload").id; // Get authorId from JWT payload
  await deletePost(Number(id), authorId);
  return c.status(204);
});

export default posts;