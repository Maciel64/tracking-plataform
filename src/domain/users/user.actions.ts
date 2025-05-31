"use server";

import { CreateUserSchema } from "@/schemas/user.schema";
import { container, DI } from "@/lib/di/container";
import { UsersService } from "./users.service";

export function getUserService() {
  return container.get<UsersService>(DI.USER_SERVICE);
}

export async function registerAction(data: CreateUserSchema) {
  const usersService = getUserService();

  console.log(usersService.returnUser());

  return usersService.create(data);
}
