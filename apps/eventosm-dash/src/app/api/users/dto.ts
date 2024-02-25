import { z } from "zod";

export const updateUserDto = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;
