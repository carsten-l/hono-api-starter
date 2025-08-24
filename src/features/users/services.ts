import prisma from "../../core/db";
import { hashSync } from "bcryptjs";

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateUser(id: number, data: { name?: string; email?: string; newPassword?: string }) {
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      password: data.newPassword ? hashSync(data.newPassword, 15) : undefined,
    },
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
