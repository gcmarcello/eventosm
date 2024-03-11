import { NewsStatus } from "@prisma/client";
import { z } from "zod";

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a valid slug")
  .min(1, "Must not be empty")
  .max(100, "Must not exceed 100 characters");

export const upsertNewsDto = z.object({
  id: z.string().optional(),
  title: z.string(),
  subtitle: z.string(),
  imageUrl: z.string().optional().nullable(),
  content: z.string(),
  slug: slugSchema,
  status: z.nativeEnum(NewsStatus),
});

export type UpsertNewsDto = z.infer<typeof upsertNewsDto>;
