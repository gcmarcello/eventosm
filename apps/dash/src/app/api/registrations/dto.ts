import { dateRegex } from "@/utils/regex";
import { readDto, sheetToJson } from "odinkit";
import { z } from "odinkit";
import { teamSignUpDto } from "../auth/dto";
import { EventRegistrationStatus, Gender } from "@prisma/client";
import { nativeEnum } from "zod";

export const excelDataSchema = z.array(
  z.object({
    CEP: z.string(),
    CPF: z.string(),
    Celular: z.string(),
    Endereço: z.string().optional(),
    Número: z.string().optional(),
    "Complemento (Opcional)": z.string().optional(),
    "Data de Nascimento (DD/MM/AAAA)": z.string(),
    "E-mail": z.string(),
    "Nome Completo": z.string(),
    Sexo: z.enum([
      "masc",
      "masculino",
      "m",
      "homem",
      "h",
      "homen",
      "fem",
      "feminino",
      "f",
      "mulher",
      "Masc",
      "Masculino",
      "M",
      "Homem",
      "H",
      "Homen",
      "Fem",
      "Feminino",
      "F",
      "Mulher",
      "MASCULINO",
      "FEMININO",
      "MASC",
      "FEM",
      "MULHER",
      "HOMEM",
      "HOMEN",
      "MULHER",
    ]),
  })
);

export type ExcelDataSchema = z.infer<typeof excelDataSchema>;

export const registrationDto = z.object({
  modalityId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  addon: z
    .object({
      id: z.string().uuid().optional(),
      option: z.string().optional(),
    })
    .optional(),
});

export type RegistrationDto = z.infer<typeof registrationDto>;

export const multipleRegistrationDto = z.object({
  userId: z.string().uuid(),
  modalityId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  selected: z.boolean().optional(),
  addon: z
    .object({
      id: z.string().uuid().optional(),
      option: z.string().optional(),
    })
    .optional(),
});

export type MultipleRegistrationDto = z.infer<typeof multipleRegistrationDto>;

export const createRegistrationDto = z.object({
  teamId: z.string().optional(),
  acceptedTerms: z
    .boolean({
      required_error: "Você deve aceitar o regulamento do evento.",
    })
    .refine((value) => value, {
      message: "Você deve aceitar o regulamento do evento.",
    }),
  batchId: z
    .string()
    .uuid({ message: "Formato de ID de lote inválido" })
    .optional(),
  registration: registrationDto,
});

export const createMultipleRegistrationsDto = z.object({
  teamId: z.string().optional(),
  batchId: z
    .string()
    .uuid({ message: "Formato de ID de lote inválido" })
    .optional(),
  teamMembers: z.array(multipleRegistrationDto),
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

export const connectRegistrationToTeamDto = z.object({
  registrationId: z.string().uuid(),
  teamId: z.string().uuid(),
});

export type ConnectRegistrationToTeamDto = z.infer<
  typeof connectRegistrationToTeamDto
>;

export const updateRegistrationDto = z.object({
  registrationId: z.string().uuid(),
  categoryId: z.string().uuid(),
  modalityId: z.string().uuid(),
  status: nativeEnum(EventRegistrationStatus),
  code: z.string(),
});

export type UpdateRegistrationDto = z.infer<typeof updateRegistrationDto>;
