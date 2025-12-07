import { auth } from "@/auth";
import { getNotificationService } from "@/domain/notifications/notification.hook";
import { NotificationCenter } from "../notifications/notification-center";
import { SidebarTrigger } from "../ui/sidebar";

export async function AppHeader() {
  const session = await auth();
  const notifications = getNotificationService().findMany(
    session?.user.id || "",
  );

  return (
    <header className="w-full p-4 flex items-center justify-between">
      <SidebarTrigger />
      <div className="flex gap-2 mr-4">
        <NotificationCenter
          notifications={notifications}
          userId={session?.user.id || ""}
        />
      </div>
    </header>
  );
}
