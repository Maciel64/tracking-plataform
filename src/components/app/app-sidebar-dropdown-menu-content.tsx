"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

import { signOut as nextAuthSignOut } from "next-auth/react";

export function AppSidebarDropdowMenuContent() {
  const handleLogout = async () => {
    await nextAuthSignOut();
  };

  return (
    <DropdownMenuContent className="w-64">
      <DropdownMenuItem
        className="flex items-center justify-between gap-2"
        onClick={handleLogout}
      >
        Sair <LogOut className="h-4 w-4" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
