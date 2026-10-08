import { prisma } from "@/lib/db";
import type { UserRole } from "@/types";

export const userService = {
  /**
   * Find a user by their unique email.
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { member: true },
    });
  },

  /**
   * Find a user by their primary ID.
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { member: true },
    });
  },

  /**
   * Check if a user has admin privileges.
   */
  async isAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === ("ADMIN" as UserRole);
  },
};
