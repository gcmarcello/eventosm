import { z } from "zod";

export const subeventEventGroupCheckinDto = z
  .object({
    document: z.string().optional(),
    registrationId: z.string().optional(),
    subeventId: z.string(),
  })
  .refine(
    (data) => {
      if (!data.document && !data.registrationId) {
        return false;
      } else return true;
    },
    {
      message: "Você deve informar um documento.",
      path: ["document"],
    }
  );

export type SubeventEventGroupCheckinDto = z.infer<
  typeof subeventEventGroupCheckinDto
>;
