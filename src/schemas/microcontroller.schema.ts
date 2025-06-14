import { z } from "zod";

export const microcontrollerSchema = z.object({
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

export type MicrocontrollerSchema = z.infer<typeof microcontrollerSchema>;
