"use server";

import { z } from "zod";
import { createUserSchema } from "@/schemas/user.schema";
import { registerAndLogin } from "@/lib/auth/auth.utils";

export async function registerAction(data: z.infer<typeof createUserSchema>) {
  try {
    const result = await registerAndLogin(data);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ocorreu um erro durante o registro");
  }
}
