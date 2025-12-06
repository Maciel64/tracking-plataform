"use server";

import { revalidateTag } from "next/cache";
import { HttpError } from "@/lib/errors/http.error";
import type { AdminCreatesUserSchema } from "@/schemas/user.schema";
import { getAdminService } from "./admin.hooks";

export async function adminCreateUserAction(
  data: AdminCreatesUserSchema,
  enterpriseId: string,
) {
  const result = await getAdminService().createUser(data, enterpriseId);
  if (result instanceof HttpError) {
    return {
      success: false,
      message: result.message,
    };
  }

  revalidateTag("find-users");

  return {
    success: true,
    message: "Usuário atualizado com sucesso",
  };
}

export async function adminUpdateUserAction(
  userId: string,
  data: AdminCreatesUserSchema,
) {
  const result = await getAdminService().updateUser(userId, data);

  if (result instanceof HttpError) {
    return {
      success: false,
      message: result.message,
    };
  }

  revalidateTag("find-users");

  return {
    success: true,
    message: "Usuário atualizado com sucesso",
  };
}

export async function adminDeleteUserAction(id: string) {
  const result = await getAdminService().deleteUser(id);

  if (result instanceof HttpError) {
    return {
      success: false,
      message: result.message,
    };
  }

  revalidateTag("find-users");

  return {
    sucess: false,
    message: "Usuário atualizado com sucesso",
  };
}
