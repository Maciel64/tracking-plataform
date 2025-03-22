import { z } from "zod";

export const userSchema = z.object({
  uid: z.string({ message: "uid must be a string" }),
  email: z.string({ message: "email must be a string" }),
  displayName: z.string({ message: "name must be a string" }),
});
