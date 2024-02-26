import { cpfValidator } from "odinkit";
import { z } from "zod";

export const updateUserDto = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  document: z.custom((value) => cpfValidator(value as string), {
    message: "CPF inválido.",
  }),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;
