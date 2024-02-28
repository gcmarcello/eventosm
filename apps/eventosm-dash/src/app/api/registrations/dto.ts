import { dateRegex } from "@/utils/regex";
import { readDto, sheetToJson } from "odinkit";
import { z } from "zod";
import { teamSignUpDto } from "../auth/dto";

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
  batchId: z
    .string()
    .uuid({ message: "Formato de ID de lote inválido" })
    .optional(),
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
    "Complemento (Opcional)": z.string().optional(),
    "Data de Nascimento (DD/MM/AAAA)": z.string(),
    "E-mail": z.string(),
    "Nome Completo": z.string(),
    Número: z.string().optional(),
    Sexo: z.string(),
  })
);

export type ExcelDataSchema = z.infer<typeof excelDataSchema>;

export const registrationDto = z.object({
  modalityId: z.string().uuid(),
  categoryId: z.string(),
  addon: z
    .object({
      id: z.string().uuid().optional(),
      option: z.string().optional(),
    })
    .optional(),
});

export type RegistrationDto = z.infer<typeof registrationDto>;

export const createMultipleRegistrationsDto = z
  .object({
    files: z.array(z.any()),
    createTeam: z.boolean().optional(),
    teamName: z.string().optional(),
    eventGroupId: z.string().uuid().optional(),
    eventId: z.string().uuid().optional(),
    batchId: z
      .string()
      .uuid({ message: "Formato de ID de lote inválido" })
      .optional(),
    teamMembers: z.array(
      z.object({
        user: teamSignUpDto,
        registration: registrationDto,
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
    organizationId: z
      .string()
      .uuid({ message: "Formato de ID de organização inválido" })
      .optional(),
    status: z.any().optional(),
  })
);

export type ReadRegistrationsDto = z.infer<typeof readRegistrations>;
