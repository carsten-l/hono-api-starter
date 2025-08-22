import { z } from "zod";
import { subscriberService } from "../services/subscriber.service";

const SubscriberSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function createSubscriberController(body: unknown) {
  const parsed = SubscriberSchema.parse(body);
  return subscriberService.create(parsed.email);
}

export async function getSubscribersController() {
  return subscriberService.getAll();
}

export async function deleteSubscriberController(body: unknown) {
  const parsed = SubscriberSchema.parse(body);
  return subscriberService.delete(parsed.email);
}
