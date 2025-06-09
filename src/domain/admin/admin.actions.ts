"use server";

import { AdminCreatesUserSchema } from "@/schemas/user.schema";
import { getAdminService } from "./admin.hooks";
import { revalidateTag } from "next/cache";

export async function adminCreateUserAction(data: AdminCreatesUserSchema) {
  await getAdminService().createUser(data);

  revalidateTag("users");

  return {
    error: false,
  };
}

export async function deleteUserAction(id: string) {
  await getAdminService().deleteUser(id);

  revalidateTag("users");

  return {
    error: false,
  };
}
