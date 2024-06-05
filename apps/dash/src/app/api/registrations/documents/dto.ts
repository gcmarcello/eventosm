import { z } from "zod";

export const upsertRegistrationDocumentDto = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  registrationId: z.string(),
  documentId: z.string(),
  userDocumentId: z.string().optional(),
  file: z.array(z.instanceof(File)).or(z.string()).optional().nullable(),
});

export type UpsertRegistrationDocumentDto = z.infer<
  typeof upsertRegistrationDocumentDto
>;
