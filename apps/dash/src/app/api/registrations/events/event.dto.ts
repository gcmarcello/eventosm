import { z } from "zod";
import { createMultipleRegistrationsDto, createRegistrationDto } from "../dto";

export const eventCreateRegistrationDto = createRegistrationDto.merge(
  z.object({ eventId: z.string().uuid() })
);

export type EventCreateRegistrationDto = z.infer<
  typeof eventCreateRegistrationDto
>;

export const eventCreateMultipleRegistrationsDto =
  createMultipleRegistrationsDto.merge(
    z.object({ eventId: z.string().uuid() })
  );

export type EventCreateMultipleRegistrationsDto = z.infer<
  typeof eventCreateMultipleRegistrationsDto
>;
