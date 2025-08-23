// src/controllers/messages.controller.ts
import { messagesService } from "../services/messages.service";
import { Prisma } from "../config";
import { messageSchema } from "../schemas";



export async function createMessageController(body: Prisma.MessageCreateInput) {
  const parsedBody = messageSchema.parse(body);
  const message = await messagesService.create(parsedBody);
  return { message };
}

export async function getMessagesController() {
  return await messagesService.getAll();
}
