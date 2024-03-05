import { readDto } from "odinkit";
import { z } from "odinkit";
import { teamSignUpDto } from "../auth/dto";
import { Gender } from "@prisma/client";

export const upsertTeamMemberDto = z.object({
  fullName: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z
    .string()
    .min(14, { message: "Telefone Inválido" })
    .max(15, { message: "Telefone inválido" }),
  document: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  info: z.object({
    birthDate: z
      .string()
      .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/),
    zipCode: z.string().regex(/^\d{5}-\d{3}$/),
    gender: z.nativeEnum(Gender),
    address: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    cityId: z.string().optional(),
    stateId: z.string().optional(),
  }),
});

export type UpsertTeamMemberDto = z.infer<typeof upsertTeamMemberDto>;

export const readTeamsDto = readDto(
  z.object({
    id: z.string().optional(),
    ownerId: z.string().optional(),
    name: z.string().optional(),
  })
);

export type ReadTeamsDto = z.infer<typeof readTeamsDto>;

export const createTeamDto = z.object({
  name: z
    .string()
    .min(3, { message: "Nome do time deve ter no mínimo 3 caracteres" })
    .max(255, { message: "Nome do time deve ter no máximo 30 caracteres" }),
  addMembers: z.boolean().optional(),
  membersFile: z.array(z.any()).optional(),
  members: z.array(upsertTeamMemberDto).optional(),
  originOrganizationId: z.string().optional(),
});

export type CreateTeamDto = z.infer<typeof createTeamDto>;
