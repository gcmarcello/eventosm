import { UserSession } from "@/middleware/functions/userSession.middleware";
import { CreateAbsenceJustificationDto, UpdateAbsenceStatusDto } from "./dto";
import { getPreSignedURL } from "../uploads/service";

export async function changeAbsenceStatus({
  absenceId,
  status,
}: UpdateAbsenceStatusDto) {
  const currentStatus = await prisma.eventAbsences.findUnique({
    where: { id: absenceId },
    select: { status: true, justificationUrl: true },
  });

  if (!currentStatus) {
    throw "Absence not found";
  }

  if (currentStatus.status === "approved") {
    throw "Cannot change status of an approved absence";
  }

  await prisma.eventAbsences.update({
    where: { id: absenceId },
    data: {
      status,
      justificationUrl:
        status === "denied" ? null : currentStatus.justificationUrl,
      registration: {
        update: {
          unjustifiedAbsences: {
            increment: status === "denied" ? 0 : -1,
          },
          justifiedAbsences: {
            increment: status === "approved" ? 1 : 0,
          },
        },
      },
    },
  });

  return await prisma.eventAbsences.update({
    where: { id: absenceId },
    data: { status },
    include: { event: true },
  });
}

export async function updateAbsenceJustification(
  data: CreateAbsenceJustificationDto<"server"> & { userSession: UserSession }
) {
  const absence = await prisma.eventAbsences.findUnique({
    where: {
      id: data.absenceId,
      registration: { userId: data.userSession.id },
    },
  });

  if (!absence) {
    throw "Absence not found";
  }

  return await prisma.eventAbsences.update({
    where: { id: data.absenceId },
    data: {
      justificationUrl: data.justificationUrl,
      status: "pending",
    },
  });
}

export async function readAbsenceJustification(data: {
  id: string;
  userSession: UserSession;
}) {
  const document = await prisma.eventAbsences.findUnique({
    where:
      data.userSession.role === "admin"
        ? { id: data.id }
        : { id: data.id, registration: { userId: data.userSession.id } },
  });

  if (!document) throw "Documento não encontrado.";

  return await getPreSignedURL({
    key: `justifications/${document.justificationUrl}`,
  });
}
