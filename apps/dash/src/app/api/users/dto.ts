import { UserDocumentType } from "@prisma/client";
import { cpfValidator } from "odinkit";
import { z } from "odinkit";

export const updateUserDto = z.object({
  fullName: z.string(),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string(),
  document: z.custom((value) => cpfValidator(value as string), {
    message: "CPF inválido.",
  }),
  info: z.object({
    birthDate: z.string(),
    gender: z.enum(["male", "female"]),
    zipCode: z.string().min(9, { message: "CEP inválido" }),
    stateId: z.string(),
    cityId: z.string(),
    address: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    support: z.string().optional(),
  }),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;

export const createUserDocumentDto = z.object({
  name: z.string().optional(),
  key: z.string(),
  type: z.nativeEnum(UserDocumentType, {
    required_error: "O tipo do documento é obrigatório.",
  }),
});

export type CreateUserDocumentDto = z.infer<typeof createUserDocumentDto>;
