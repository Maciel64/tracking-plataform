export type User = {
  telefone?: string;
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
  role: "USER" | "ADMIN";
  status: "ENABLED" | "DISABLED";
  bio?: string;
  photoURL?: string;
  twoFactorEnabled?: boolean;
  lastLogin?: string;   // <--- adicione aqui
  lastIp?: string;      // <--- adicione aqui
  lastDevice?: string; 
};
