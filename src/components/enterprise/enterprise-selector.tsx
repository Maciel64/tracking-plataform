"use client";

import { ChevronDown } from "lucide-react";
import type { User } from "next-auth";
import { useState } from "react";
import { useSession } from "next-auth/react";
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
import { getUserEnterprise } from "@/domain/enterprises/enterprise.actions";
import { toast } from "sonner";
import { HttpError } from "@/lib/errors/http.error";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface EnterpriseSelectorProps {
  user: User;
}

export function EnterpriseSelector({ user }: EnterpriseSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession();
  const userId = session?.user.id || "";
  const router = useRouter();

  const handleSelectEnterprise = async (enterpriseId: string) => {
    setIsLoading(true);

    try {
      const activeEnterprise = await getUserEnterprise(userId, enterpriseId);

      if (activeEnterprise instanceof HttpError)
        return toast.error(activeEnterprise.message);

      await update({
        activeEnterprise,
      });

      router.refresh();
    } catch (error) {
      console.error("Erro ao mudar empresa:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

        {user.enterprises?.map((enterprise) => {
          const enterpriseIsCurrent =
            enterprise.id === session?.user.activeEnterprise?.id;

          return (
            <DropdownMenuItem
              key={enterprise.id}
              onClick={() => handleSelectEnterprise(enterprise.id || "")}
              className={cn(!enterpriseIsCurrent && "cursor-pointer")}
              disabled={enterpriseIsCurrent}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{enterprise.name}</span>
                <span className="text-xs text-muted-foreground">
                  {mapRoleToLabel(enterprise.role || "")}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
