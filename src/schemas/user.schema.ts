import { z } from "zod";

export const userSchema = z.object({
  uid: z.string({ message: "uid must be a string" }),
  email: z.string({ message: "email must be a string" }),
  displayName: z.string({ message: "name must be a string" }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
