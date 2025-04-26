"use client";

import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  return (
    <header className="w-full p-4">
      <SidebarTrigger />
    </header>
  );
}
