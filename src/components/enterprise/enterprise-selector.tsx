"use client";

import { ChevronDown } from "lucide-react";
import type { User } from "next-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mapRoleToLabel } from "@/domain/users/user.helpers";

interface EnterpriseSelectorProps {
  user: User;
}

export function EnterpriseSelector({ user }: EnterpriseSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectEnterprise = async (enterpriseId: string) => {
    setIsLoading(true);
    try {
      // await setActiveEnterprise(enterpriseId);
      // A página será revalidada automaticamente
      console.log();
    } catch (error) {
      console.error("Erro ao mudar empresa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <p>Usuário não autenticado</p>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-transparent mt-4"
          disabled={isLoading}
        >
          <span className="truncate">{user.activeEnterprise?.name}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Suas Empresas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.enterprises?.map((enterprise) => (
          <DropdownMenuItem
            key={enterprise.id}
            onClick={() => handleSelectEnterprise(enterprise.id || "")}
            className="cursor-pointer"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{enterprise.name}</span>
              <span className="text-xs text-muted-foreground">
                {mapRoleToLabel(enterprise.role || "")}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
