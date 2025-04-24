import { signIn } from "next-auth/react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/adapters/firebase.adapter";
import { api } from "@/lib/api";
import { CreateUserSchema } from "@/schemas/user.schema";

// Autentica usando NextAuth e Firebase
export async function authenticate(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    

    // Autentica com NextAuth
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    

    if (!res?.ok) {
      return {
        success: false,
        error: "Email ou senha inválidos",
      };
    }

    // Autentica com Firebase
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

// Registra usuário na API e no Firebase, e já faz login
export async function registerAndLogin(data: CreateUserSchema) {
  try {
    // Registra no backend (sua API + Firestore)
    await api.post("/auth/register", data);

    // Cria conta no Firebase Authentication
    await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);

    // Faz login nos dois (NextAuth e Firebase)
    const { success, error } = await authenticate(data.email, data.password);

    if (!success) throw new Error(error);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
