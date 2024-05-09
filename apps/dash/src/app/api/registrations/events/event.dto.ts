import { z } from "zod";
import { createMultipleRegistrationsDto, createRegistrationDto } from "../dto";
import { signupDto } from "../../auth/dto";

export const eventCreateRegistrationDto = createRegistrationDto.merge(
  z.object({ eventId: z.string().uuid() })
);

export type EventCreateRegistrationDto = z.infer<
  typeof eventCreateRegistrationDto
>;

export const signupRegistrationDto = signupDto.merge(
  eventCreateRegistrationDto
);

export type SignupRegistrationDto = z.infer<typeof signupRegistrationDto>;

export const eventCreateMultipleRegistrationsDto =
  createMultipleRegistrationsDto.merge(
    z.object({ eventId: z.string().uuid() })
  );

export type EventCreateMultipleRegistrationsDto = z.infer<
  typeof eventCreateMultipleRegistrationsDto
>;
