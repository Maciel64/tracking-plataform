import { z } from "zod";

export const createCoordinateSchema = z.object({
  latitude: z
    .number({ message: "latitude must be a number" })
    .min(-90, {
      message: "latitude must be between -90 and 90",
    })
    .max(90, {
      message: "latitude must be between -90 and 90",
    }),
  longitude: z
    .number({ message: "longitude must be a number" })
    .min(-180, {
      message: "longitude must be between -180 and 180",
    })
    .max(180, {
      message: "longitude must be between -180 and 180",
    }),
  microcontrollerId: z.string({
    message: "microcontrollerId must be a string",
  }),
});

export type CreateCoordinateSchema = z.infer<typeof createCoordinateSchema>;
