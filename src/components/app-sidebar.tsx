"use client";

import {
  LayoutDashboard,
  Users,
  User as UserIcon,
  Settings,
  LogOut,
  Microchip,
  MapIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { User } from "@/@types/user";

const roleBasedRoutes = {
  ADMIN: {
    Admin: [
      {
        label: "Microcontroladores",
        href: "/microcontrollers",
        icon: Microchip,
      },
      {
        label: "Mapas",
        href: "/maps",
        icon: MapIcon,
      },
      {
        label: "Usuários",
        href: "/users",
        icon: Users,
      },
    ],
    Menu: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
    Pessoal: [
      {
        label: "Perfil",
        href: "/profile",
        icon: UserIcon,
      },
      {
        label: "Configurações",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
  USER: {
    Menu: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
    Pessoal: [
      {
        label: "Perfil",
        href: "/profile",
        icon: UserIcon,
      },
      {
        label: "Configurações",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
  undefined: {
    Menu: [],
    Configurações: [],
  },
};

export function AppSidebar({ user }: { user: User }) {
  const routes = user?.role as keyof typeof roleBasedRoutes;

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Raster Logo" width={16} height={26} />
          <span className="text-xl font-bold">Raster</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {Object.keys(roleBasedRoutes[routes]).map((item) => (
          <SidebarGroup key={item}>
            <SidebarGroupLabel>{item}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {roleBasedRoutes[routes][
                  item as keyof (typeof roleBasedRoutes)[typeof routes]
                ].map((route) => (
                  <SidebarMenuItem key={route.label}>
                    <SidebarMenuButton asChild>
                      <Link href={route.href}>
                        <route.icon className="h-4 w-4" />
                        {route.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user?.email?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64">
            <DropdownMenuItem
              className="flex items-center justify-between gap-2"
              onClick={() => signOut()}
            >
              Sair <LogOut className="h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
