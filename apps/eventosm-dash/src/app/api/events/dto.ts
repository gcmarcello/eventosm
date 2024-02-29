import { dateRegex } from "@/utils/regex";
import { ZodEffects, ZodObject, ZodRawShape, ZodTypeAny, z } from "zod";
import { readDto } from "../_shared/dto/read";
import { EventStatus } from "@prisma/client";

export const upsertEventTypeDto = z.object({
  id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(255, { message: "O nome deve ter menos de 255 caracteres" }),
  resultsModel: z.any(),
});

export type UpsertEventTypeDto = z.infer<typeof upsertEventTypeDto>;

export const upsertEventDto = z.object({
  id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(255, { message: "O nome deve ter menos de 255 caracteres" }),
  slug: z
    .string()
    .min(3, { message: "O slug deve ter pelo menos 3 caracteres" })
    .max(30, { message: "O slug deve ter menos de 30 caracteres" })
    .optional(),
  eventGroupId: z
    .string()
    .uuid({ message: "Formato de ID do grupo de eventos inválido" })
    .optional(),
  dateStart: z
    .string()
    .regex(dateRegex, { message: "Formato de data inválido" }),
  dateEnd: z.string().regex(dateRegex, { message: "Formato de data inválido" }),
  location: z
    .string()
    .min(3, { message: "A localização deve ter pelo menos 3 caracteres" })
    .max(255, { message: "A localização deve ter menos de 255 caracteres" }),
  description: z.string().optional(),
  rules: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type UpsertEventDto = z.infer<typeof upsertEventDto>;

export const upsertEventGroupRulesDto = z.object({
  resultType: z.enum(["time", "points"]),
  mode: z.enum(["league", "cup"]),
  scoreCalculation: z.enum(["sum", "average"]),
  pointsAwarded: z
    .array(z.object({ position: z.number(), points: z.number() }))
    .optional(),
  groupStage: z.boolean().optional(),
  groupSize: z.number().optional(),
  discard: z.string().optional(),
  justifiedAbsences: z.string().optional(),
  unjustifiedAbsences: z.string().optional(),
});

export type UpsertEventGroupRulesDto = z.infer<typeof upsertEventGroupRulesDto>;

export const upsertEventGroupDto = z.object({
  id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
  description: z.string().optional(),
  rules: z.string().optional(),
  imageUrl: z.string().optional(),
  location: z.string().optional(),
  details: z.string().optional(),
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(255, { message: "O nome deve ter menos de 255 caracteres" }),
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
  registrationType: z.enum(["individual", "team", "mixed"]),
  eventGroupType: z.enum(["championship", "free"]),
  ruleLogic: upsertEventGroupRulesDto.optional(),
});

export type UpsertEventGroupDto = z.infer<typeof upsertEventGroupDto>;

export const upsertEventModalityDto = z.object({
  id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(255, { message: "O nome deve ter menos de 255 caracteres" }),
  eventId: z
    .string()
    .uuid({ message: "Formato de ID do evento inválido" })
    .optional(),
  eventGroupId: z
    .string()
    .uuid({ message: "Formato de ID do evento inválido" })
    .optional(),
});

export type UpsertEventModalityDto = z.infer<typeof upsertEventModalityDto>;

export const upsertEventModalityCategoriesDto = z.object({
  categories: z.array(
    z.object({
      id: z
        .string()
        .uuid({ message: "Formato de ID inválido" })
        .optional()
        .nullable(),
      name: z
        .string()
        .min(3, { message: "O nome deve ter entre 3 e 255 caracteres" })
        .max(255, { message: "O nome deve ter entre 3 e 255 caracteres" }),
      eventModalityId: z
        .string()
        .uuid({ message: "Formato de ID da modalidade inválido" }),
      minAge: z
        .number()
        .min(1, { message: "A idade mínima deve ser entre 1 e 120" })
        .max(120, { message: "A idade máxima deve ser entre 1 e 120" }),
      maxAge: z
        .number()
        .min(1, { message: "A idade mínima deve ser entre 1 e 120" })
        .max(120, { message: "A idade máxima deve ser entre 1 e 120" }),
      gender: z
        .enum(["female", "male", "unisex"], {
          description: "O gênero deve ser feminino, masculino ou outro",
        })
        .nullable(),
    })
  ),
});

export type UpsertEventModalityCategoriesDto = z.infer<
  typeof upsertEventModalityCategoriesDto
>;

export const readEventTypeDto = readDto(
  z.object({ id: z.string().uuid().optional() })
);

export type ReadEventTypeDto = z.infer<typeof readEventTypeDto>;

export const readEventDto = readDto(
  z.object({
    id: z.string().uuid().optional(),
    eventGroupId: z.string().uuid().nullable().optional(),
    organizationId: z.string().uuid().optional(),
    Organization: z
      .object({
        slug: z.string().optional(),
      })
      .optional(),
    status: z.nativeEnum(EventStatus).optional(),
  })
);

export type ReadEventDto = z.infer<typeof readEventDto>;

export const readEventGroupDto = readDto(
  z.object({
    id: z.string().uuid().optional(),
    organizationId: z.string().uuid().optional(),
    slug: z.string().optional(),
    status: z.nativeEnum(EventStatus).optional(),
    Organization: z
      .object({
        slug: z.string().optional(),
      })
      .optional(),
  })
);

export type ReadEventGroupDto = z.infer<typeof readEventGroupDto>;

export const readEventGroupCheckinsAndAbsencesDto = readDto(
  z.object({
    userId: z.string().uuid(),
    eventGroupId: z.string().uuid(),
  })
);

export type ReadEventGroupCheckinsAndAbsencesDto = z.infer<
  typeof readEventGroupCheckinsAndAbsencesDto
>;

export const readEventModalitiesDto = readDto(
  z.object({
    eventId: z.string().uuid().optional(),
    eventGroupId: z.string().uuid().optional(),
    id: z.string().uuid().optional(),
    organizationId: z.string().uuid().optional(),
    Organization: z
      .object({
        slug: z.string().optional(),
      })
      .optional(),
  })
);

export type ReadEventModalitiesDto = z.infer<typeof readEventModalitiesDto>;
