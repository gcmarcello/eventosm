import { cpfValidator } from "@/utils/validators/cpf.validator";
import { z } from "zod";
import { readDto } from "../_shared/dto/read";

export const createOrganizationDto = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  slug: z.custom((data: any) => {
    return (
      /^[a-z0-9]+(-[a-z0-9]+)*$/.test(data) &&
      !data?.startsWith("-") &&
      !data?.endsWith("-")
    );
  }),
  phone: z
    .string()
    .min(14, { message: "Telefone Inválido" })
    .max(15, { message: "Telefone inválido" }),
  document: z
    .string()
    .optional()
    .refine(
      (data) => {
        if (!data) return true;
        const isCpfValid = cpfValidator(data);
        return isCpfValid;
      },
      {
        message: "CPF inválido",
        path: ["value"],
      }
    ),
  domain: z.string().optional(),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationDto>;

const readOrganizationDto = readDto(
  z.object({
    id: z.string().optional(),
    slug: z.string().optional(),
    ownerId: z.string().optional(),
  })
);

export type ReadOrganizationDto = z.infer<typeof readOrganizationDto>;
