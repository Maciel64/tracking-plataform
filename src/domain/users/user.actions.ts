"use server";

import { CreateUserSchema } from "@/schemas/user.schema";
import { getUserService } from "./user.hooks";
import { error_handler } from "@/lib/errors/handler.error";

export async function register(data: CreateUserSchema) {
  return error_handler(async () => {
    const usersService = getUserService();

    return usersService.create(data);
  });
}
