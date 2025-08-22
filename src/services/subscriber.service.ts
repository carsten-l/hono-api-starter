import prisma from "../config";

export const subscriberService = {
  create: async (email: string) => {
    return prisma.subscriber.create({ data: { email } });
  },
  getAll: async () => {
    return prisma.subscriber.findMany();
  },
  delete: async (email: string) => {
    return prisma.subscriber.delete({ where: { email } });
  }
};