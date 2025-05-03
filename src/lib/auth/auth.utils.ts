import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/adapters/firebase.adapter";
import { api } from "@/lib/api";
import { CreateUserSchema } from "@/schemas/user.schema";

export async function authenticate(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await signInWithEmailAndPassword(firebaseAuth, email, password);

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
