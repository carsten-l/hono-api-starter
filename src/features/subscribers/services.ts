import prisma from "../../core/db";

export async function createSubscriber(email: string) {
    return prisma.subscriber.create({ data: { email } });
  }
  
  export async function getAllSubscribers() {
  return prisma.subscriber.findMany();
  }

  export async function deleteSubscriber(email: string) {
    return prisma.subscriber.delete({ where: { email } });
  }
