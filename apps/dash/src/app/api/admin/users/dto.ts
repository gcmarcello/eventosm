import { z } from "zod";
import { updateUserDto } from "../../users/dto";

export const adminUpdateUserDto = updateUserDto.merge(
  z.object({
    userId: z.string(),
    role: z.string().optional(),
    confirmed: z.boolean().optional(),
  })
);

export type AdminUpdateUserDto = z.infer<typeof adminUpdateUserDto>;
