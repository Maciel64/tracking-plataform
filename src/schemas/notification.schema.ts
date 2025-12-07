import z from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  type: z.enum(["INFO", "WARNING", "CONFIRMATION"]),
  action: z.enum(["ENTERPRISE_INVITATION"]),
  userId: z.string(),
  enterpriseId: z.string(),
});

export const updateNotificationSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  message: z.string().min(1).max(500).optional(),
  read: z.boolean().optional(),
  deletedAt: z.date().nullable().optional(),
  confirmed: z.boolean().optional(),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationSchema = z.infer<typeof updateNotificationSchema>;
