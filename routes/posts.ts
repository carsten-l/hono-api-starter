
import { Hono } from "hono";
import prisma from "../src/config";
import type { NewPost } from "../src/types";

const posts = new Hono();


posts.get("/", async (c) => {
    let posts = await prisma.post.findMany();
    return c.json(posts);
});
posts.get("/:id", async (c) => {
    const id = c.req.param("id");
    let post = await prisma.post.findUnique({
        where: { id: Number(id) },
    });
    return c.json(post);
});
posts.post("/", async (c) => {
    const body: NewPost = await c.req.json();
    let post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            published: body.published !== undefined ? body.published : undefined,
            authorId: body.authorId
        },
    });
    return c.json(post);
});

posts.put("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    let post = await prisma.post.update({
        where: { id: Number(id) },
        data: {
            title: body.title,
            content: body.content,
            published: body.published !== undefined ? body.published : undefined,
        },
    });
    return c.json(post);
});

posts.delete("/:id", async (c) => {
    const id = c.req.param("id");
    await prisma.post.delete({
        where: { id: Number(id) },
    });
    return c.json({ message: "Post deleted" });
});

export default posts;