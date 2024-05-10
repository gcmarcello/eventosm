import { z } from "zod";

const createPaymentDto = z.object({
  registrations: z.string().array().optional(),
  subscriptions: z.string().array().optional(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentDto>;
