import NextAuth from "next-auth";
import { pages } from "./domain/config/pages";
import CredentialsProvider from "next-auth/providers/credentials";
import { firestoreAdapter } from "./lib/adapters/firebase.adapter";
import { UsersService } from "./domain/users/users.service";
import { UsersRepository } from "./domain/users/users.repository";


const usersService = new UsersService(new UsersRepository(firestoreAdapter));

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages,
  callbacks: {
    async redirect() {
      return "/dashboard";
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "USER";
        token.id = (user as any).id ?? "";
        token.name = (user as any).name ?? "";
        token.email = (user as any).email ?? "";
      }
    
      console.log("Token gerado:", token); // <-- Adiciona esse log
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
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        try {
          const user = await usersService.login({ email, password });

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
