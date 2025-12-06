import { z } from "zod";
import { userRoles, userStatus } from "@/domain/users/user.model";

export const createEnterpriseSchema = z.object({
  name: z.string().min(2).max(20),
  userId: z.string(),
  role: z.enum(userRoles),
  status: z.enum(userStatus),
});

export const addUserSchema = z.object({
  enterpriseId: z.string(),
  userId: z.string(),
  role: z.enum(userRoles),
  status: z.enum(userStatus),
});

export type CreateEnterpriseSchema = z.infer<typeof createEnterpriseSchema>;
export type AddUserSchema = z.infer<typeof addUserSchema>;
