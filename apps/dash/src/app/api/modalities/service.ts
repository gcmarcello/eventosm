import { UserSession } from "@/middleware/functions/userSession.middleware";
import { DeleteModalityDto } from "./dto";
import { Organization } from "@prisma/client";

export async function deleteModality(
  data: DeleteModalityDto & {
    userSession: UserSession;
    organization: Organization;
  }
) {
  return await prisma.$transaction([
    prisma.modalityCategory.updateMany({
      where: { eventModalityId: data.id },
      data: { eventModalityId: data.targetModalityId },
    }),
    prisma.eventRegistration.updateMany({
      where: { modalityId: data.id },
      data: {
        modalityId: data.targetModalityId,
      },
    }),
    prisma.eventModality.delete({
      where: { id: data.id },
    }),
  ]);
}

export async function readEventModalities(eventId: string) {
  const modalities = await prisma.eventModality.findMany({
    where: { eventId },
    include: { modalityCategory: true },
  });
  return modalities;
}
