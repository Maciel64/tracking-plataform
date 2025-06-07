"use client";

import { CardDescription } from "@/components/ui/card";

import { use } from "react";
import { UserResponseDTO } from "@/domain/users/user.model";

interface UsersCardDescriptionProps {
  usersPromise: Promise<UserResponseDTO[]>;
}

export function UsersCardDescription({
  usersPromise,
}: UsersCardDescriptionProps) {
  const users = use(usersPromise);

  return (
    <CardDescription>{users?.length} usuários encontrados</CardDescription>
  );
}
