// src/controllers/messages.controller.ts
import { z } from "zod";
import { messagesService } from "../services/messages.service";
import { Prisma } from "../config";

const MessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function createMessage(body: Prisma.MessageCreateInput) {
  const parsedBody = MessageSchema.parse(body);
  const message = await messagesService.create(parsedBody);
  return { message };
}

export async function getMessages() {
  return await messagesService.getAll();
}
