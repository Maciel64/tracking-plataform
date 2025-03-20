import { z } from "zod";

export const createCoordinateSchema = z.object({
  latitude: z.number({ message: "latitude must be a number" }),
  longitude: z.number({ message: "longitude must be a number" }),
  microcontroller_uid: z.string({
    message: "microcontroller_uid must be a string",
  }),
});
