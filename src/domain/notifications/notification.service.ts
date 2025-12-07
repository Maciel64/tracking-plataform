import type {
  CreateNotificationSchema,
  UpdateNotificationSchema,
} from "@/schemas/notification.schema";
import type { UserRepository } from "../users/user.repository";
import type { NotificationRepository } from "./notification.repository";

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  findMany(userId: string) {
    return this.notificationRepository.findMany(userId);
  }

  create(data: CreateNotificationSchema) {
    return this.notificationRepository.create(data);
  }

  update(id: string, data: UpdateNotificationSchema) {
    return this.notificationRepository.update(id, data);
  }

  updateManyByUserId(userId: string, data: UpdateNotificationSchema) {
    return this.notificationRepository.updateManyByUserId(userId, data);
  }

  async handleNotificationConfirm(id: string, confirmed: boolean) {
    if (confirmed) {
      const notification = await this.notificationRepository.find(id);

      switch (notification?.action) {
        case "ENTERPRISE_INVITATION": {
          await this.userRepository.update(notification.userId, {
            status: "ENABLED",
          });

          break;
        }

        default:
          break;
      }
    }

    return this.notificationRepository.update(id, {
      confirmed,
      read: true,
    });
  }
}
