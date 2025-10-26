import {
  LayoutDashboard,
  MapIcon,
  Microchip,
  Settings,
  User as UserIcon,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "next-auth";
import logo from "@/assets/images/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Card, CardContent } from "../ui/card";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AppSidebarDropdowMenuContent } from "./app-sidebar-dropdown-menu-content";

type Route = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type RoleBasedRoutes = {
  [role: string]: {
    [section: string]: Route[];
  };
};

const roleBasedRoutes: RoleBasedRoutes = {
  OWNER: {
    Admin: [
      {
        label: "Usuários",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Microcontroladores",
        href: "/admin/microcontrollers",
        icon: Microchip,
      },
      {
        label: "Mapas",
        href: "/admin/maps",
        icon: MapIcon,
      },
    ],
    Menu: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
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
  ADMIN: {
    Admin: [
      {
        label: "Usuários",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Microcontroladores",
        href: "/admin/microcontrollers",
        icon: Microchip,
      },
      {
        label: "Mapas",
        href: "/admin/maps",
        icon: MapIcon,
      },
    ],
    Menu: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
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
    Microcontroladores: [
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
};

export function AppSidebar({ user }: { user?: User }) {
  const routes =
    user?.activeEnterprise?.role &&
    roleBasedRoutes[user?.activeEnterprise?.role]
      ? user?.activeEnterprise?.role
      : "USER";

  return (
    <Sidebar className="md:min-w-[200px]">
      <SidebarHeader className="border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Rastcom Logo" width={16} height={26} />
          <span className="text-xl font-bold">Rastcom</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Card>
              <CardContent>{user?.activeEnterprise?.name}</CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>

        {roleBasedRoutes[routes] ? (
          Object.keys(roleBasedRoutes[routes]).map((section) => (
            <SidebarGroup key={section}>
              <SidebarGroupLabel>{section}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {roleBasedRoutes[routes][section].map((route: Route) => (
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
          ))
        ) : (
          <div className="text-center">
            Nenhuma rota disponível para este usuário.
          </div>
        )}
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

          <AppSidebarDropdowMenuContent />
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
