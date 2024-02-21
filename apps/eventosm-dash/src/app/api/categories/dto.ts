import { z } from "zod";
import { readDto } from "../_shared/dto/read";

export const readModalityCategoriesDto = readDto(
  z.object({
    eventModalityId: z.string().uuid().optional(),
    id: z.string().uuid().optional(),
  })
);

export type ReadEventCategoryModalitiesDto = z.infer<
  typeof readModalityCategoriesDto
>;
