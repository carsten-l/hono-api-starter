import { subscriberService } from "../services/subscriber.service";
import { subscriberSchema } from "../schemas";


export async function createSubscriberController(body: unknown) {
  const parsed = subscriberSchema.parse(body);
  return subscriberService.create(parsed.email);
}

export async function getSubscribersController() {
  return subscriberService.getAll();
}

export async function deleteSubscriberController(body: unknown) {
  const parsed = subscriberSchema.parse(body);
  return subscriberService.delete(parsed.email);
}
