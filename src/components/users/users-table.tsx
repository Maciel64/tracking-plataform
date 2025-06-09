"use client";

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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Trash, UserCog } from "lucide-react";
import { Button } from "../ui/button";
import { User, UserResponseDTO } from "@/domain/users/user.model";
import { UsersDialog } from "./users-dialog";
import { use, useState } from "react";
import { UsersDeleteDialog } from "./users-delete-dialog";

interface UserTableProps {
  usersPromise: Promise<UserResponseDTO[]>;
}

enum UserStatusMap {
  ENABLED = "Ativo",
  DISABLED = "Inativo",
}

enum UserRoleMap {
  USER = "Usuário",
  ADMIN = "Administrador",
}

export function UsersTable({ usersPromise }: UserTableProps) {
  const users = use(usersPromise);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
                <TableCell>{UserRoleMap[user.role]}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "ENABLED" ? "default" : "secondary"
                    }
                  >
                    {UserStatusMap[user.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.role === "USER" && (
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
