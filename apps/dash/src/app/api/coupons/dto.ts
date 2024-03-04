import { z } from "zod";

export const upsertCouponBatchDto = z.object({
  id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
  slug: z
    .string()
    .min(3, { message: "O slug deve ter pelo menos 3 caracteres" })
    .max(30, { message: "O slug deve ter menos de 30 caracteres" }),
  eventRegistrationBatchId: z
    .string()
    .uuid({ message: "Formato de ID do lote de inscrição de evento inválido" }),
  maxUses: z
    .number()
    .min(1, { message: "O número máximo de usos deve ser pelo menos 1" }),
  overruler: z.boolean(),
  type: z.enum(["percentage", "fixed"], {
    description: "Tipo inválido (deve ser 'percentage' ou 'fixed')",
  }),
});

export type UpsertCouponBatchDto = z.infer<typeof upsertCouponBatchDto>;
