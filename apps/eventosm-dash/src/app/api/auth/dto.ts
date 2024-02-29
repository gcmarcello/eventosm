import { z } from "zod";
import { cpfValidator } from "@/utils/validators/cpf.validator";
import { birthDateValidator } from "@/utils/validators/birthDate.validator";

export const signupDto = z.object({
  fullName: z.string().min(3).max(255),
  email: z.string().email({ message: "Email inválido" }),
  document: z
    .custom((data) => cpfValidator(data as string), {
      message: "CPF inválido.",
    })
    .optional(),
  foreigner: z.boolean().optional(),
  foreignDocument: z.string().optional(),
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
  organizationId: z.string().optional(),
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

export const teamSignUpDto = z.object({
  fullName: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z
    .string()
    .min(14, { message: "Telefone Inválido" })
    .max(15, { message: "Telefone inválido" }),
  document: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  birthDate: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/),
  gender: z.string(),
  address: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export type TeamSignUpDto = z.infer<typeof teamSignUpDto>;
