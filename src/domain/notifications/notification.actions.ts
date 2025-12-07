"use server";

import { revalidateTag } from "next/cache";
import { getNotificationService } from "./notification.hook";

export async function markNotificationAsRead(notificationId: string) {
  try {
    await getNotificationService().update(notificationId, {
      read: true,
    });

    revalidateTag("notifications");

    return { success: true };
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    throw new Error("Falha ao atualizar notificação");
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await getNotificationService().updateManyByUserId(userId, {
      read: true,
    });

    revalidateTag("notifications");

    return { success: true };
  } catch (error) {
    console.error("Erro ao marcar todas notificações como lidas:", error);
    throw new Error("Falha ao atualizar notificações");
  }
}

export async function confirmNotification(
  notificationId: string,
  confirmed: boolean,
) {
  try {
    await getNotificationService().handleNotificationConfirm(
      notificationId,
      confirmed,
    );

    revalidateTag("notifications");

    return { success: true };
  } catch (error) {
    console.error("Erro ao confirmar notificação:", error);
    throw new Error("Falha ao confirmar notificação");
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await getNotificationService().update(notificationId, {
      deletedAt: new Date(),
    });

    revalidateTag("notifications");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
    throw new Error("Falha ao deletar notificação");
  }
}
