// src/services/messages.service.ts
import prisma, { Prisma } from "../../core/db";
import type { NewMessage } from "../messages/validation"; 


  export async function createMessage (data: NewMessage) {
    return await prisma.message.create({ data });
  }

  export async function getAllMessages () {
    return await prisma.message.findMany();
  }


