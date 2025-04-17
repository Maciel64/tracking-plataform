import { signIn } from "next-auth/react";
import { api } from "@/lib/api";
import { CreateUserSchema } from "@/schemas/user.schema";

// Autentica usando NextAuth
export async function authenticate(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    console.log("🔍 signIn response:", res);

    if (!res?.ok) {
      return {
        success: false,
        error: "Email ou senha inválidos",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: "Erro ao autenticar",
    };
  }
}

export async function registerAndLogin(data: CreateUserSchema) {
  try {
    await api.post("/auth/register", data);

    const { success, error } = await authenticate(data.email, data.password);

    if (!success) throw new Error(error);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
