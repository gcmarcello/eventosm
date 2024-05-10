import { z } from "odinkit";
import { readDto } from "../_shared/dto/read";
import {
  ColorId,
  OrganizationDocumentStatus,
  OrganizationDocumentType,
} from "@prisma/client";

export const upsertOrganizationDto = z.object({
  name: z
    .string()
    .min(3, { message: "Nome deve ter mais de 3 caracteres." })
    .max(100),
  email: z.string().min(3).email({ message: "Email Inválido" }),
  slug: z.custom(
    (data: any) => {
      return (
        /^[a-z0-9]+(-[a-z0-9]+)*$/.test(data) &&
        !data?.startsWith("-") &&
        !data?.endsWith("-") &&
        (data as string)?.length >= 3
      );
    },
    { message: "Link inválido" }
  ),
  phone: z
    .string()
    .min(14, { message: "Telefone Inválido" })
    .max(15, { message: "Telefone inválido" }),
  document: z.string().optional().nullable(),
  options: z
    .object({
      socialMedia: z.object({
        facebook: z.string().url().or(z.literal("")).optional(),
        instagram: z.string().url().or(z.literal("")).optional(),
        twitter: z.string().url().or(z.literal("")).optional(),
        youtube: z.string().url().or(z.literal("")).optional(),
      }),
    })
    .optional(),
  abbreviation: z.string().max(15, { message: "No máximo 15 caracteres" }),
});

export type UpsertOrganizationDto = z.infer<typeof upsertOrganizationDto>;

export const updateOrganizationStyleDto = z.object({
  primaryColor: z.nativeEnum(ColorId),
  secondaryColor: z.nativeEnum(ColorId),
  tertiaryColor: z.nativeEnum(ColorId),
  images: z
    .object({
      bg: z.string().optional(),
      hero: z.string().optional(),
      logo: z.string().optional(),
    })
    .optional(),
});

export type UpdateOrganizationStyleDto = z.infer<
  typeof updateOrganizationStyleDto
>;

const readOrganizationDto = readDto(
  z.object({
    id: z.string().optional(),
    slug: z.string().optional(),
    ownerId: z.string().optional(),
  })
);

export type ReadOrganizationDto = z.infer<typeof readOrganizationDto>;

export const upsertOrganizationDocumentDto = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  key: z.string(),
  highlight: z.boolean().optional(),
  status: z.nativeEnum(OrganizationDocumentStatus),
  type: z.nativeEnum(OrganizationDocumentType),
});

export type UpsertOrganizationDocumentDto = z.infer<
  typeof upsertOrganizationDocumentDto
>;
