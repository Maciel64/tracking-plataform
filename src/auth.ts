import NextAuth from "next-auth";
import { pages } from "./domain/config/pages";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "./schemas/user.schema";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as fireauth } from "@/lib/adapters/firebase.adapter";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages,
  callbacks: {
    async redirect() {
      return "/";
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        loginSchema.parse(credentials);

        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const res = await signInWithEmailAndPassword(
          fireauth,
          email!,
          password!
        );

        return {
          id: res.user.uid,
          name: "Ainda não tem kkkkkk",
          email: res.user.email,
        };
      },
    }),
  ],
});
