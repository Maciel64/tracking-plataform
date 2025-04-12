import { signIn } from "@/auth";
import { api } from "@/lib/api";
import { CreateUserSchema } from "@/schemas/user.schema";

export async function authenticate(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: "Email ou senha inválidos",
    };
  }
}

export async function registerAndLogin(data: CreateUserSchema) {
  try {
    // Primeiro, faz o registro
    await api.post("/auth/register", data);

    // Depois, faz o login automaticamente
    const { success, error } = await authenticate(data.email, data.password);

    if (!success) {
      throw new Error(error);
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
