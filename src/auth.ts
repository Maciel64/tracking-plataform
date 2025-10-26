export const runtime = "nodejs";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pages } from "./domain/config/pages";
import { getUserService } from "./domain/users/user.hooks";
import { HttpError } from "./lib/errors/http.error";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages,
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id ?? "";
        token.name = user.name ?? "";
        token.email = user.email ?? "";
        token.enterprises = user.enterprises ?? [];
        token.activeEnterprise = user.activeEnterprise;
      }

      if (trigger === "update" && session?.activeEnterprise) {
        token.activeEnterprise = session.activeEnterprise;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.name = typeof token.name === "string" ? token.name : "";
        session.user.email = typeof token.email === "string" ? token.email : "";
        session.user.enterprises = token.enterprises;
        session.user.activeEnterprise = token.activeEnterprise;
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

        const result = await userService.login({ email, password });

        if (result instanceof HttpError) {
          return null;
        }

        if (!result.activeEnterprise) {
          return null;
        }

        return result;
      },
    }),
  ],
});
