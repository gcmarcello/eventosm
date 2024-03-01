import { z } from "odinkit";

export const upsertPasswordRecoveryTokenDto = z.object({
  identifier: z.string(),
  type: z.enum(["email", "phone", "document"]),
  organizationId: z.string().optional(),
});

export type UpsertPasswordRecoveryTokenDto = z.infer<
  typeof upsertPasswordRecoveryTokenDto
>;

export const readPasswordRecoveryTokenDto = z.object({
  token: z.string(),
});

export type ReadPasswordRecoveryTokenDto = z.infer<
  typeof readPasswordRecoveryTokenDto
>;

export const createNewPasswordDto = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine(
    (data) => {
      return !!(data.password === data.confirmPassword);
    },
    { message: "As senhas não coincidem.", path: ["confirmPassword"] }
  );

export type CreateNewPasswordDto = z.infer<typeof createNewPasswordDto>;
