// types/next-auth.d.ts
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";
import type { EnterpriseDTO } from "@/domain/enterprises/enterprise.model";

declare module "next-auth" {
  /**
   * Extendendo a interface Session padrão
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      enterprises?: EnterpriseDTO[];
      activeEnterprise?: EnterpriseDTO;
    } & DefaultSession["user"];
  }

  /**
   * Extendendo a interface User padrão
   */
  interface User {
    id: string;
    name: string;
    email: string;
    enterprises?: EnterpriseDTO[];
    activeEnterprise?: EnterpriseDTO;
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
    enterprises?: EnterpriseDTO[];
    activeEnterprise?: EnterpriseDTO;
  }
}
