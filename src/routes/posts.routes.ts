
import { Hono } from "hono";
import { z } from "zod"; // <-- needed to detect ZodError
import type { NewPost } from "../types";
import { getPosts, getPostById, createPost, updatePost, deletePost } from "../controllers/posts.controller";

const posts = new Hono();


posts.get("/", async (c) => {
    try {
        let posts = await getPosts();
        return c.json(posts);
    } catch (error) {
        return c.json({ success: false, message: "Error fetching posts" }, 500);
    }
});
posts.get("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        let post = await getPostById(Number(id));
        return c.json(post);
    } catch (error) {
        return c.json({ success: false, message: "Error fetching post" }, 500);
    }
});

posts.post("/", async (c) => {
    try {
        const body: NewPost = await c.req.json();
        const post = await createPost(body);
        return c.json(post);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: { type: "validation", errors: error.errors } });
        }
        throw error;
    }
});

posts.put("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        let post = await updatePost(Number(id), body);
        return c.json(post);
        
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: { type: "validation", errors: error.errors } });
        }
        throw error;
    }
});


posts.delete("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        await deletePost(Number(id));
        return c.json({ message: "Post deleted" });
    } catch (error) {
        return c.json({ success: false, message: "Error deleting post" }, 500);
    }
});

export default posts;