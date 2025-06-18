import type React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Metadata } from "next";
import { auth } from "@/auth";
import { User } from "@/domain/users/user.model";

export const metadata: Metadata = {
  title: "Raster | Dashboard",
  description: "Locazação e rastreio de veículos gerenciados por você",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar user={(await auth())?.user as User} />
        <div className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 bg-muted/40 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
