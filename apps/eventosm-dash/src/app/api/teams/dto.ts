import { readDto } from "odinkit";
import { z } from "zod";

export const readTeamsDto = readDto(
  z.object({
    id: z.string().optional(),
    ownerId: z.string().optional(),
    name: z.string().optional(),
  })
);

export type ReadTeamsDto = z.infer<typeof readTeamsDto>;

export const createTeamDto = z.object({
  name: z.string(),
  members: z.array(z.string().uuid()),
  ownerId: z.string().uuid(),
});

export type CreateTeamDto = z.infer<typeof createTeamDto>;
