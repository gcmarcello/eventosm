import { cpfValidator } from "@/utils/validators/cpf.validator";
import { z } from "zod";
import { readDto } from "../_shared/dto/read";

export const upsertOrganizationDto = z.object({
  name: z.string().min(3, { message: "Nome deve ter mais de 3 caracteres." }).max(100),
  email: z.string().min(3).email({ message: "Email Inválido" }),
  slug: z.custom(
    (data: any) => {
      return (
        /^[a-z0-9]+(-[a-z0-9]+)*$/.test(data) &&
        !data?.startsWith("-") &&
        !data?.endsWith("-") &&
        (data as string)?.length >= 3
      );
    },
    { message: "Link inválido" }
  ),
  phone: z
    .string()
    .min(14, { message: "Telefone Inválido" })
    .max(15, { message: "Telefone inválido" }),
  document: z.string().optional().nullable(),
  /* .refine(
      (data) => {
        if (!data) return true;
        const isCpfValid = cpfValidator(data);
        return isCpfValid;
      },
      {
        message: "CPF inválido",
        path: ["value"],
      }
    ) @todo Validador de CNPJ */ domain: z.string().optional(),
});

export type UpsertOrganizationDto = z.infer<typeof upsertOrganizationDto>;

const readOrganizationDto = readDto(
  z.object({
    id: z.string().optional(),
    slug: z.string().optional(),
    ownerId: z.string().optional(),
  })
);

export type ReadOrganizationDto = z.infer<typeof readOrganizationDto>;
