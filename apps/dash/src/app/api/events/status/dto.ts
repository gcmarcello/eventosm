import { EventStatus } from "@prisma/client";
import { z } from "odinkit";

export const updateEventStatusDto = z.object({
  eventId: z.string().uuid().optional(),
  eventGroupId: z.string().uuid().optional(),
  status: z.nativeEnum(EventStatus),
});

export type UpdateEventStatusDto = z.infer<typeof updateEventStatusDto>;

export const updateEventGroupStatusDto = z.object({
  eventGroupId: z.string().uuid(),
  status: z.nativeEnum(EventStatus),
});

export type UpdateEventGroupStatusDto = z.infer<
  typeof updateEventGroupStatusDto
>;
