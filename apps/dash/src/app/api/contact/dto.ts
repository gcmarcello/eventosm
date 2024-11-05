import { z } from "zod";

export const createContactDto = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export type CreateContactDto = z.infer<typeof createContactDto>;
