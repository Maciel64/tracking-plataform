"use server";

import { auth } from "@/auth";
import { getUserService } from "@/domain/users/user.hooks";
import { HttpError } from "@/lib/errors/http.error";

export async function getUserEnterprise(userId: string, enterpriseId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const userService = getUserService();

  const result = await userService.getUserEnterprise(userId, enterpriseId);

  if (result instanceof HttpError) {
    return {
      success: false,
      message: result.message,
    };
  }

  return result;
}
