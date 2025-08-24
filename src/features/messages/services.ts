// src/services/messages.service.ts
import prisma, { Prisma } from "../../core/db";


  export async function createMessage (data: Prisma.MessageCreateInput) {
    return await prisma.message.create({ data });
  }

  export async function getAllMessages () {
    return await prisma.message.findMany();
  }


