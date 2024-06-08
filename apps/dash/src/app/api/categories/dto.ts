import { z } from "odinkit";
import { readDto } from "../_shared/dto/read";
import { UserDocumentType } from "@prisma/client";

export const readModalityCategoriesDto = readDto(
  z.object({
    eventModalityId: z.string().uuid().optional(),
    id: z.string().uuid().optional(),
  })
);

export type ReadEventCategoryModalitiesDto = z.infer<
  typeof readModalityCategoriesDto
>;

export const upsertCategoryDocumentsDto = z.object({
  documents: z.array(
    z.object({
      id: z.string().uuid().optional(),
      categoryId: z.string().uuid(),
      name: z.string().max(100).optional().nullable(),
      template: z
        .array(z.instanceof(File))
        .or(z.string())
        .optional()
        .nullable(),
      type: z.nativeEnum(UserDocumentType),
    })
  ),
});

export type UpsertCategoryDocumentsDto = z.infer<
  typeof upsertCategoryDocumentsDto
>;

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
