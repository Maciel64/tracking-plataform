export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
  role: "USER" | "ADMIN";
  status: "ENABLED" | "DISABLED";
};
