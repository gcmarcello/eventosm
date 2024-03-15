import { z } from "zod";

export const subeventEventGroupCheckinDto = z.object({
  document: z.string().optional(),
  registrationId: z.string().optional(),
  subeventId: z.string(),
});

export type SubeventEventGroupCheckinDto = z.infer<
  typeof subeventEventGroupCheckinDto
>;
