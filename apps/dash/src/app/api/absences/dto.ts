import { EventAbsenceStatus } from "@prisma/client";
import { ZodDto, ZodDtoEnv } from "odinkit";
import { z } from "odinkit";

const createAbsenceJustificationDto = <E extends "client" | "server">(
  env: E
) => {
  const dto = z.object({
    absenceId: z.string(),
  });

  const envs = {
    client: z.object({
      justification: z.array(z.instanceof(File)),
    }),
    server: z.object({
      justificationUrl: z.string(),
    }),
  };

  return dto.merge(envs[env]);
};

export type CreateAbsenceJustificationDto<E extends ZodDtoEnv> = ZodDto<
  typeof createAbsenceJustificationDto<E>
>;

export const updateAbsenceStatusDto = z.object({
  absenceId: z.string(),
  status: z.nativeEnum(EventAbsenceStatus),
});

export type UpdateAbsenceStatusDto = z.infer<typeof updateAbsenceStatusDto>;
