import { prisma } from "@/providers/prisma/prisma.provider";
import type {
  CreateNotificationSchema,
  UpdateNotificationSchema,
} from "@/schemas/notification.schema";

export class NotificationRepository {
  find(id: string) {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  findMany(userId: string) {
    return prisma.notification.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  create(data: CreateNotificationSchema) {
    return prisma.notification.create({
      data: {
        message: data.message,
        title: data.title,
        type: data.type,
        userId: data.userId,
        enterpriseId: data.enterpriseId,
      },
    });
  }

  update(id: string, date: UpdateNotificationSchema) {
    return prisma.notification.update({
      where: { id },
      data: date,
    });
  }

  updateManyByUserId(userId: string, data: UpdateNotificationSchema) {
    return prisma.notification.updateMany({
      where: { userId },
      data,
    });
  }
}
