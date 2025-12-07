import { container, DI } from "@/lib/di/container";
import type { NotificationService } from "./notification.service";

export function getNotificationService() {
  return container.get<NotificationService>(DI.NOTIFICATION_SERVICE);
}
