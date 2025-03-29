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
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
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
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await usersService.login({ email, password });

        return user;
      },
    }),
  ],
});
