import NextAuth from "next-auth";
import { pages } from "./domain/config/pages";
import CredentialsProvider from "next-auth/providers/credentials";
import { firestoreAdapter } from "./lib/adapters/firebase.adapter";
import { UsersService } from "./domain/users/users.service";
import { UsersRepository } from "./domain/users/users.repository";


// Inicializando o serviço de usuários
const usersService = new UsersService(new UsersRepository(firestoreAdapter));

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages,
  callbacks: {
    // Callback de redirecionamento após o login
    async redirect() {
      return "/dashboard";
    },
    // Callback de JWT para adicionar dados ao token
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "USER";
        token.id = (user as any).id ?? ""; // A propriedade id deve existir no user
        token.name = (user as any).name ?? "";
        token.email = (user as any).email ?? "";
      }
    
      console.log("Token gerado:", token); // Log para verificar os dados do token
      return token;
    },
    // Callback de session para manipulação de sessão
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
            id: user.id ?? "",        // Certifique-se de que o 'user' tenha 'id'
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
