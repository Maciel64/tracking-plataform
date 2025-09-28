import { z } from "zod";

export const createMicrocontrollerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/, "MAC inválido"),
  model: z.string().min(1, "Modelo é obrigatório"),
  chip: z.string().min(1, "Chip é obrigatório"),
  plate: z.string().min(1, "Placa é obrigatória"),
  vehicleType: z.enum(["CAR", "MOTORCYCLE", "TRUCK"], {
    required_error: "Tipo é obrigatório",
  }),
  active: z.boolean().default(true),
});

export const updateMicrocontrollerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/, "MAC inválido")
    .optional(),
  model: z.string().min(1, "Modelo é obrigatório").optional(),
  chip: z.string().min(1, "Chip é obrigatório").optional(),
  plate: z.string().min(1, "Placa é obrigatória").optional(),
  vehicleType: z
    .enum(["CAR", "MOTORCYCLE", "TRUCK"], {
      required_error: "Tipo é obrigatório",
    })
    .optional(),
  active: z.boolean().default(true).optional(),
});

export type CreateMicrocontrollerSchema = z.infer<
  typeof createMicrocontrollerSchema
>;
export type UpdateMicrocontrollerSchema = z.infer<
  typeof updateMicrocontrollerSchema
>;
