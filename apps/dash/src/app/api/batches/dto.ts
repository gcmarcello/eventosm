import { z } from "odinkit";
import { readDto } from "../_shared/dto/read";
import { dateRegex, dateTimeRegex, timeRegex } from "@/utils/regex";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { isString } from "lodash";
dayjs.extend(customParseFormat);

export const upsertRegistrationBatchDto = z.object({
  id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .optional(),
  eventId: z
    .string()
    .uuid({ message: "Formato de ID do evento inválido" })
    .optional(),
  eventGroupId: z
    .string()
    .uuid({ message: "Formato de ID do grupo inválido" })
    .optional(),
  maxRegistrations: z.number().min(1, {
    message: "O número máximo de inscrições deve ser pelo menos 1",
  }),
  registrationType: z.enum(["individual", "team", "mixed"]),
  categoryControl: z.boolean().optional(),
  categoryBatch: z
    .array(
      z.object({
        id: z.string().uuid({ message: "Formato de ID inválido" }).optional(),
        categoryId: z
          .string()
          .uuid({ message: "Formato de ID de categoria inválido" }),
        modalityId: z
          .string()
          .uuid({ message: "Formato de ID de modalidade inválido" }),
        maxRegistrations: z.number().nullable().optional(),
        price: z.string().nullable().optional(),
      })
    )
    .optional(),
  dateStart: z
    .string()
    .regex(dateRegex, { message: "Formato de data de início inválido" }),
  timeStart: z
    .string()
    .regex(timeRegex, { message: "Formato de hora de início inválido" }),
  dateEnd: z
    .string()
    .regex(dateRegex, { message: "Formato de data de término inválido" }),
  timeEnd: z
    .string()
    .regex(timeRegex, { message: "Formato de hora de término inválido" }),
  price: z.custom(
    (value) =>
      isString(value) &&
      !Number.isNaN(value.replaceAll(",", ".")) &&
      Number(value.replaceAll(",", ".")) >= 0
  ),
  multipleRegistrationLimit: z.number().optional(),
  protectedBatch: z.boolean().optional(),
});

export type UpsertRegistrationBatchDto = z.infer<
  typeof upsertRegistrationBatchDto
>;

export const readRegistrationBatchDto = readDto(
  z.object({
    id: z.string().uuid().optional(),
    eventId: z.string().uuid().optional(),
    eventGroupId: z.string().uuid().optional(),
  })
);

export type ReadRegistrationBatchDto = z.infer<typeof readRegistrationBatchDto>;
