import { EventStatus } from "@prisma/client";
import { readDto } from "odinkit";
import { z } from "odinkit";

export const readEventAddonsDto = readDto(
  z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      eventGroupId: z.string().optional(),
      eventId: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      status: z.nativeEnum(EventStatus).optional(),
    })
    .optional()
);

export type ReadEventAddonDto = z.infer<typeof readEventAddonsDto>;

export const upsertEventAddonDto = z.object({
  id: z.string().optional(),
  name: z.string(),
  image: z.string().optional(),
  eventGroupId: z.string().optional(),
  eventId: z.string().optional(),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(?:,\d+)?$/g),
  status: z.nativeEnum(EventStatus).optional(),
  options: z.array(z.object({ name: z.string() })).optional(),
});

export type UpsertEventAddonDto = z.infer<typeof upsertEventAddonDto>;
