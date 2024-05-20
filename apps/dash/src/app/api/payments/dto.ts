import { z } from "zod";

const createPaymentDto = z.object({
  status: z.enum(["pending", "paid", "cancelled"]).default("pending"),
  registrations: z.string().array().optional(),
  subscriptions: z.string().array().optional(),
  value: z.number(),
  userId: z.string().uuid(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentDto>;
