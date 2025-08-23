import prisma, { Prisma } from "../config";
import type { NewPost } from "../schemas";

export const postsService = {
  create: async (data: NewPost) => {
    const prismaData: Prisma.PostCreateInput = {
      title: data.title,
      content: data.content,
      published: data.published,
      author: {
        connect: {
          id: data.authorId
        }
      }
    };
    return prisma.post.create({ data: prismaData });
  },
  getAll: async () => {
    return prisma.post.findMany();
  },
  getById: async (id: number) => {
    return prisma.post.findUnique({ where: { id } });
  },
  update: async (id: number, data: NewPost) => {
    const prismaData: Prisma.PostUpdateInput = {
      title: data.title,
      content: data.content,
      published: data.published,
      author: {
        connect: {
          id: data.authorId
        }
      }
    };
    return prisma.post.update({ where: { id }, data: prismaData });
  },
  delete: async (id: number) => {
    return prisma.post.delete({ where: { id } });
  },
};
