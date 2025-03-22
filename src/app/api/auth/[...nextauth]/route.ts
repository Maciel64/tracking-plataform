import { auth } from "@/lib/adapters/firebase.adapter";
import { loginSchema } from "@/schemas/user.schema";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pages } from "@/domain/config/pages";

const handler = NextAuth({
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

        const email = credentials?.email;
        const password = credentials?.password;

        const res = await signInWithEmailAndPassword(auth, email!, password!);

        return {
          id: res.user.uid,
          name: "Ainda não tem kkkkkk",
          email: res.user.email,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
