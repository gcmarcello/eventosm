import { cpfValidator } from "odinkit";
import { z } from "odinkit";

export const updateUserDto = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  document: z.custom((value) => cpfValidator(value as string), {
    message: "CPF inválido.",
  }),
  info: z.object({
    birthDate: z.string(),
    gender: z.enum(["male", "female"]),
    zipCode: z.string(),
    stateId: z.string(),
    cityId: z.string(),
    address: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    support: z.string().optional(),
  }),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;
