import { z } from "zod";

export const subeventEventGroupCheckinDto = z.object({
  registrationId: z.string(),
  subeventId: z.string(),
  confirm: z.boolean(),
});

export type SubeventEventGroupCheckinDto = z.infer<
  typeof subeventEventGroupCheckinDto
>;
