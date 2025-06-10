"use server";

import { AdminCreatesUserSchema } from "@/schemas/user.schema";
import { getAdminService } from "./admin.hooks";
import { revalidateTag } from "next/cache";

export async function adminCreateUserAction(data: AdminCreatesUserSchema) {
  await getAdminService().createUser(data);

  revalidateTag("users");

  return {
    error: false,
    message: "Usuário atualizado com sucesso",
    statusCode: 201,
  };
}

export async function adminUpdateUserAction(
  userId: string,
  data: AdminCreatesUserSchema
) {
  await getAdminService().updateUser(userId, data);

  revalidateTag("users");

  return {
    error: false,
    message: "Usuário atualizado com sucesso",
    statusCode: 200,
  };
}

export async function adminDeleteUserAction(id: string) {
  await getAdminService().deleteUser(id);

  revalidateTag("users");

  return {
    error: false,
    message: "Usuário atualizado com sucesso",
    statusCode: 200,
  };
}
