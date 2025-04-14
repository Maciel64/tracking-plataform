"use client";

import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  return (
    <header
      className={`
     sticky top-0 z-50 w-full p-4
     `}
    >
      <SidebarTrigger />
    </header>
  );
}
