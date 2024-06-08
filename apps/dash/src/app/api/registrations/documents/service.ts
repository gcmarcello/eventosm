import { UpsertRegistrationDocumentDto } from "./dto";

export async function upsertRegistrationDocument(
  data: UpsertRegistrationDocumentDto[]
) {
  if (data.some((document) => typeof document.file !== "string"))
    throw "Erro no envio de documentos. Tente novamente.";

  return await prisma.$transaction(
    data.map((doc) => {
      const documentId = doc.id ?? crypto.randomUUID();
      return prisma.registrationDocument.upsert({
        where: { id: documentId },
        update: { ...doc, file: doc.file as string },
        create: { ...doc, id: documentId, file: doc.file as string },
      });
    })
  );
}
