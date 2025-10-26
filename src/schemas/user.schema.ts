import { z } from "zod";

export const userSchema = z.object({
  uid: z.string({ message: "uid must be a string" }),
  email: z.string({ message: "email must be a string" }),
  name: z.string({ message: "name must be a string" }),
});

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string(),
    enterpriseName: z
      .string()
      .min(3, {
        error: "O nome da empresa deve ter no mínimo 3 caracteres",
      })
      .max(20, {
        error: "O nome da empresa deve ter no máximo 20 caracteres",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

export const adminCreatesUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.enum(["USER", "ADMIN", "OWNER"]).default("USER"),
  status: z.enum(["ENABLED", "DISABLED"]).default("ENABLED"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type AdminCreatesUserSchema = z.infer<typeof adminCreatesUserSchema>;
