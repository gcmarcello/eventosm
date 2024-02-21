import { dateRegex } from "@/utils/regex";
import { readDto, sheetToJson } from "odinkit";
import { z } from "zod";

export const upsertCouponBatchDto = z.object({
  id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
  slug: z
    .string()
    .min(3, { message: "O slug deve ter pelo menos 3 caracteres" })
    .max(30, { message: "O slug deve ter menos de 30 caracteres" }),
  eventRegistrationBatchId: z
    .string()
    .uuid({ message: "Formato de ID do lote de inscrição de evento inválido" }),
  maxUses: z
    .number()
    .min(1, { message: "O número máximo de usos deve ser pelo menos 1" }),
  overruler: z.boolean(),
  type: z.enum(["percentage", "fixed"], {
    description: "Tipo inválido (deve ser 'percentage' ou 'fixed')",
  }),
});

export type UpsertCouponBatchDto = z.infer<typeof upsertCouponBatchDto>;

export const upsertRegistrationDto = z.object({
  id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
  acceptedTerms: z.boolean({ coerce: true }),
  teamId: z
    .string()
    .uuid({ message: "Formato de ID de time inválido" })
    .optional(),
  modalityId: z
    .string()
    .uuid({ message: "Formato de ID de modalidade inválido" }),
  categoryId: z
    .string()
    .uuid({ message: "Formato de ID de categoria inválido" }),
  couponId: z
    .string()
    .uuid({ message: "Formato de ID de cupom inválido" })
    .optional(),
  eventId: z
    .string()
    .uuid({ message: "Formato de ID de evento inválido" })
    .optional(),
  eventGroupId: z
    .string()
    .uuid({ message: "Formato de ID de grupo de evento inválido" })
    .optional(),
  addon: z
    .object({
      id: z
        .string()
        .uuid({ message: "Formato de ID de addon de evento inválido" })
        .optional(),
      option: z.string().optional(),
    })
    .optional(),
});

export type UpsertRegistrationDto = z.infer<typeof upsertRegistrationDto>;

export const excelDataSchema = z.array(
  z.object({
    CEP: z.string(),
    CPF: z.string(),
    Celular: z.string(),
    Complemento: z.string().optional(),
    "Data de Nascimento": z.string(),
    "E-mail": z.string(),
    "Nome Completo": z.string(),
    Número: z.string().optional(),
    Sexo: z.string(),
  })
);

export type ExcelDataSchema = z.infer<typeof excelDataSchema>;

export const createMultipleRegistrationsDto = z
  .object({
    files: z.array(z.any()),
    createTeam: z.boolean().optional(),
    teamName: z.string().optional(),
    eventGroupId: z.string().uuid().optional(),
    eventId: z.string().uuid().optional(),
    teamMembers: z.array(
      z.object({
        user: z.object({
          name: z.string(),
          email: z.string(),
          phone: z.string(),
          document: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
          birthDate: z
            .string()
            .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/),
          zipCode: z.string().regex(/^\d{5}-\d{3}$/),
          gender: z.string(),
          street: z.string().optional(),
          number: z.string().optional(),
          complement: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
        }),
        registration: z.object({
          modalityId: z.string().uuid(),
          categoryId: z.string().uuid(),
          addon: z
            .object({
              id: z.string().uuid().optional(),
              option: z.string().optional(),
            })
            .optional(),
        }),
      })
    ),
  })
  .refine((data) => !(data.createTeam && !data.teamName), {
    message: "Nome do time é obrigatório",
    path: ["teamName"],
  });

export type CreateMultipleRegistrationsDto = z.infer<
  typeof createMultipleRegistrationsDto
>;

export const readRegistrations = readDto(
  z.object({
    id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
    userId: z
      .string()
      .uuid({ message: "Formato de ID de usuário inválido" })
      .optional(),
    eventId: z
      .string()
      .uuid({ message: "Formato de ID de evento inválido" })
      .optional(),
    eventGroupId: z
      .string()
      .uuid({ message: "Formato de ID de grupo de evento inválido" })
      .optional(),
  })
);

export type ReadRegistrationsDto = z.infer<typeof readRegistrations>;
