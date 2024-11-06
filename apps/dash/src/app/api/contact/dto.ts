import { z } from "zod";

export const createTicketDto = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string(),
});

export const createOrgTicketDto = createTicketDto.merge(
  z.object({
    organizationId: z.string(),
  })
);

export type CreateTicketDto = z.infer<typeof createTicketDto>;

export type CreateOrgTicketDto = z.infer<typeof createOrgTicketDto>;
