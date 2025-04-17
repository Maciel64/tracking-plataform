import { AdapterUser } from "next-auth/adapters";

export interface User extends AdapterUser {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: boolean;  // Adicionando a propriedade emailVerified
}