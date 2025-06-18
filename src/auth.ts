export const runtime = "nodejs";

import NextAuth from "next-auth";
import { pages } from "./domain/config/pages";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@/domain/users/user.model";
import { getUserService } from "./domain/users/user.hooks";

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
      async authorize(data) {
        const email = data?.email as string;
        const password = data?.password as string;

        const userService = getUserService();

        return await userService.login({ email, password });
      },
    }),
  ],
});
