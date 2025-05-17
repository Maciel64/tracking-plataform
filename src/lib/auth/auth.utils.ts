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
    // Primeiro, tente autenticar com Firebase
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (firebaseError) {
      console.error("Firebase authentication error:", firebaseError);
      return {
        success: false,
        error: "Email ou senha inválidos",
      };
    }
    
    // Se o Firebase autenticar com sucesso, então autentique com NextAuth
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
    // Primeiro, tente criar a conta no Firebase Authentication
    try {
      await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
    } catch (firebaseError) {
      console.error("Firebase registration error:", firebaseError);
      throw new Error("Erro ao criar conta no Firebase");
    }
    
    // Depois, registre no backend (sua API + Firestore)
    try {
      await api.post("/auth/register", data);
    } catch (apiError) {
      console.error("API registration error:", apiError);
      throw new Error("Erro ao registrar usuário na API");
    }
    
    // Faz login nos dois (NextAuth e Firebase)
    const { success, error } = await authenticate(data.email, data.password);
    if (!success) throw new Error(error);
    
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
