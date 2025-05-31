export const runtime = "nodejs";

import NextAuth from "next-auth";
import { pages } from "./domain/config/pages";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@/types/user";

// Inicializando o serviço de usuários

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Só redireciona para URLs internas do seu app
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
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
      async authorize() {
        try {
          const user = {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            role: "USER",
          };

          if (!user) return null;

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
