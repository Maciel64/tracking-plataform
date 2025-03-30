"use client";

import { Bell } from "lucide-react";

import { Search } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />

      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-6">
        <form className="relative flex-1 md:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
          />
        </form>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
        </Button>
      </div>
    </header>
  );
}
