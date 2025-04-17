// types/next-auth.d.ts
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extendendo a interface Session padrão
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * Extendendo a interface User padrão
   */
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extendendo a interface JWT padrão
   */
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}