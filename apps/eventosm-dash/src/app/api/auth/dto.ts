import { z } from "zod";
import { cpfValidator } from "@/utils/validators/cpf.validator";
import { birthDateValidator } from "@/utils/validators/birthDate.validator";

export const signupDto = z.object({
  fullName: z.string().min(3).max(255),
  email: z.string().email({ message: "Email inválido" }),
  document: z
    .object({
      value: z.string(),
      foreigner: z.boolean().default(false).optional(),
    })
    .refine(
      (data) => {
        if (data.foreigner) {
          return true;
        }
        const isCpfValid = cpfValidator(data.value);
        return isCpfValid;
      },
      {
        message: "CPF inválido",
        path: ["document", "value"],
      }
    ),
  phone: z
    .string()
    .min(14, { message: "Telefone Inválido" })
    .max(15, { message: "Telefone inválido" }),
  passwords: z
    .object({
      password: z.string().min(6).max(255),
      passwordConfirm: z.string().min(6).max(255),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Senhas não conferem",
      path: ["passwordConfirm"],
    }),
  info: z.object({
    birthDate: z.custom(
      (value) =>
        birthDateValidator(value as string, { maxAge: 120, minAge: 1 }),
      { message: "Idade inválida" }
    ),
    gender: z.enum(["male", "female"]),
    address: z.string().min(3).max(255),
    number: z.string(),
    complement: z.string().optional(),
    cityId: z.string(),
    stateId: z.string(),
    zipCode: z.string().min(9),
  }),
  eventRedirect: z.object({ name: z.string(), id: z.string() }).optional(),
});

export type SignupDto = z.infer<typeof signupDto>;

export const loginDto = z.object({
  identifier: z
    .string({ required_error: "Obrigatório." })
    .min(1, { message: "Use seu email, documento ou telefone." }),
  password: z
    .string({ required_error: "Obrigatório." })
    .min(1, { message: "Digite sua senha." }),
  organizationId: z.string().optional(),
  acceptTerms: z.boolean().optional(),
  redirect: z.string().optional(),
});

export type LoginDto = z.infer<typeof loginDto>;
