"use client";

import { MoreHorizontal, Trash, UserCog } from "lucide-react";
import { useSession } from "next-auth/react";
import { use, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mapRoleToLabel,
  mapStatusToLabel,
  userCanEdit,
} from "@/domain/users/user.helpers";
import type { UserResponseDTO } from "@/domain/users/user.model";
import { Button } from "../ui/button";
import { UsersDeleteDialog } from "./users-delete-dialog";
import { UsersDialog } from "./users-dialog";

interface UserTableProps {
  usersPromise: Promise<UserResponseDTO[]>;
}

export function UsersTable({ usersPromise }: UserTableProps) {
  const users = use(usersPromise);
  const { data: session } = useSession();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponseDTO | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{mapRoleToLabel(user.role)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "ENABLED" ? "default" : "secondary"
                    }
                  >
                    {mapStatusToLabel(user.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {userCanEdit(
                    session?.user?.activeEnterprise?.role || "USER",
                    user.role,
                  ) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentUser(user);
                            setIsDialogOpen(true);
                          }}
                        >
                          <UserCog className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeletingUserId(user.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Apagar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UsersDialog
        currentUser={currentUser}
        isDialogOpen={isDialogOpen}
        setCurrentUser={setCurrentUser}
        setIsDialogOpen={setIsDialogOpen}
      />

      <UsersDeleteDialog
        deletingUserId={deletingUserId}
        setDeletingUserId={setDeletingUserId}
      />
    </>
  );
}
