import type React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { User } from "@/components/server/user";
import { AppHeader } from "@/components/app-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar user={await User()} />
        <div className="flex-1 overflow-hidden">
          <AppHeader />
          <main className="bg-muted/40 p-6 min-h-screen">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
