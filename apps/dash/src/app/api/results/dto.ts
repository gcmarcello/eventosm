import { z } from "zod";

export const createResultsDto = z.object({
  athletes: z.array(
    z.object({
      score: z.string().optional(),
      code: z.string(),
    })
  ),
  eventId: z.string(),
  eventGroupId: z.string().optional(),
  file: z.array(z.any()).optional(),
});

export type CreateResultsDto = z.infer<typeof createResultsDto>;
