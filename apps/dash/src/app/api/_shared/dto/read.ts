import { z } from "odinkit";
import { ZodTypeAny } from "zod";

const paginationDto = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.any(),
  count: z.number().optional(),
});

export type Pagination = z.infer<typeof paginationDto>;

//zod 3.23 update broke this type
export const readDto = <W extends ZodTypeAny>(where: any) =>
  z.object({
    pagination: paginationDto.optional(),
    where: where.optional(),
  });
