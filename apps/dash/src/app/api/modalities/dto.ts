import { z } from "zod";

export const deleteModalityDto = z.object({
  id: z.string(),
  targetModalityId: z.string(),
});

export type DeleteModalityDto = z.infer<typeof deleteModalityDto>;
