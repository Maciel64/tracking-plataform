"use server";

import { z } from "zod";
import { loginSchema } from "@/schemas/user.schema";
import { authenticate } from "@/lib/auth/auth.utils";

export async function loginAction(data: z.infer<typeof loginSchema>) {
  const { success, error } = await authenticate(data.email, data.password);

  if (!success) {
    throw new Error(error);
  }

  return { success: true };
}
