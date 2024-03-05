import { z } from "zod";
import { createMultipleRegistrationsDto, createRegistrationDto } from "../dto";

export const eventGroupCreateRegistrationDto = createRegistrationDto.merge(
  z.object({ eventGroupId: z.string().uuid() })
);

export type EventGroupCreateRegistrationDto = z.infer<
  typeof eventGroupCreateRegistrationDto
>;

export const eventGroupCreateMultipleRegistrationsDto =
  createMultipleRegistrationsDto.merge(
    z.object({ eventGroupId: z.string().uuid() })
  );

export type EventGroupCreateMultipleRegistrationsDto = z.infer<
  typeof eventGroupCreateMultipleRegistrationsDto
>;
