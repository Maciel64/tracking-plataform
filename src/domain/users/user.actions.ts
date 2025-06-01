"use server";

import { CreateUserSchema } from "@/schemas/user.schema";
import { getUserService } from "./user.hooks";

export async function register(data: CreateUserSchema) {
  const usersService = getUserService();

  return usersService.create(data);
}
