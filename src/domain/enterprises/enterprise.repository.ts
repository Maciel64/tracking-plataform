import { prisma } from "@/providers/prisma/prisma.provider";
import type { UserEnterprise } from "../users/user.model";
import type { Enterprise } from "./enterprise.model";

export class EnterpriseRepository {
  find(id: string) {
    return prisma.enterprise.findFirst({
      where: {
        id,
      },
    });
  }

  findByName(name: string) {
    return prisma.enterprise.findFirst({
      where: {
        name,
      },
    });
  }

  findMany() {
    return prisma.enterprise.findMany();
  }

  findByUserId(userId: string) {
    return prisma.enterprise.findMany({
      where: {
        deletedAt: null,
        users: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        users: {
          where: { userId },
          select: {
            role: true,
            status: true,
            enterpriseId: true,
          },
        },
      },
    });
  }

  create(enterprise: Enterprise & UserEnterprise) {
    return prisma.enterprise.create({
      data: {
        name: enterprise.name || "",
        users: {
          create: [
            {
              role: enterprise.role,
              status: enterprise.status,
              userId: enterprise.userId || "",
            },
          ],
        },
      },
    });
  }

  addUser(enterprise: UserEnterprise) {
    return prisma.userEnterprise.create({
      data: {
        role: enterprise.role,
        status: enterprise.status,
        userId: enterprise.userId || "",
        enterpriseId: enterprise.enterpriseId || "",
      },
    });
  }
}
