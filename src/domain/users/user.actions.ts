"use server";

import { CreateUserSchema } from "@/schemas/user.schema";
import { getUserService } from "./user.hooks";
import { HttpError } from "@/lib/errors/http.error";

export async function register(data: CreateUserSchema) {
  const result = await getUserService().create(data);

  if (result instanceof HttpError) {
    return {
      success: false,
      message: result.message,
    };
  }

  return {
    success: true,
    message: "Cadastro realizado com sucesso",
  };
}
