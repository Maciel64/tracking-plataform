"use client";

import { Bell } from "lucide-react";

import { Search } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher"; // Ajuste o caminho

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
