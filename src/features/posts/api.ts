
import { Hono } from "hono";
import { z } from "zod"; // <-- needed to detect ZodError
import { zValidator } from "@hono/zod-validator";
import { postSchema, type NewPost } from "./validation";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "./services";

const posts = new Hono();


posts.get("/", async (c) => {
    let posts = await getAllPosts();
    return c.json(posts);
});


posts.get("/:id", async (c) => {
        const id = c.req.param("id");
        let post = await getPostById(Number(id));
        return c.json(post);
});

posts.post("/", 
    zValidator("json", postSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
  }), 
    async (c) => {

        const body: NewPost = await c.req.valid("json");
        const post = await createPost(body);
        return c.json(post);
    
    }
);

posts.put("/:id", zValidator("json", postSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
  }), async (c) => {
    
        const id = c.req.param("id");
        const body = await c.req.valid("json");
        let post = await updatePost(Number(id), body);
        return c.json(post);
    }
);

posts.delete("/:id", async (c) => {
        const id = c.req.param("id");
        await deletePost(Number(id));
        return c.json({ message: "Post deleted" });
 
});

export default posts;