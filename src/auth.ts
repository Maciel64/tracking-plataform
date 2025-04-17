export const runtime = "nodejs";

import NextAuth from "next-auth";
import { pages } from "./domain/config/pages";
import CredentialsProvider from "next-auth/providers/credentials";
import { firestoreAdapter } from "./lib/adapters/firebase.adapter";
import { UsersService } from "./domain/users/users.service";
import { UsersRepository } from "./domain/users/users.repository";
import type { User } from "@/types/user";

// Inicializando o serviço de usuários
const usersService = new UsersService(new UsersRepository(firestoreAdapter));

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages,
  callbacks: {
    async redirect() {
      return "/dashboard";
    },

    async jwt(params) {
      const { token, user } = params;
      
      if (user) {
        token.role = (user as User).role ?? "USER";
        token.id = user.id ?? "";
        token.name = user.name ?? "";
        token.email = user.email ?? "";
      }
      
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : "";
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.name = typeof token.name === "string" ? token.name : "";
        session.user.email = typeof token.email === "string" ? token.email : "";
      }
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Função de autenticação
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        try {
          // Chamando o serviço de login para autenticar
          const user = await usersService.login({ email, password });

          // Se não encontrar o usuário, retorna null
          if (!user) return null;

          // Retorna o objeto de usuário com id, name, email e role
          return {
            id: user.id ?? "",
            name: user.name ?? "",
            email: user.email ?? "",
            role: user.role ?? "USER",
          };
        } catch (e) {
          console.error("Erro ao logar:", e);
          return null;
        }
      },
    }),
  ],
});