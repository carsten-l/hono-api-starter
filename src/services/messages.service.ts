// src/services/messages.service.ts
import prisma, { Prisma } from "../config";

export const messagesService = {
  create: async (data: Prisma.MessageCreateInput) => {
    return await prisma.message.create({ data });
  },
  getAll: async () => {
    return await prisma.message.findMany();
  },
};

