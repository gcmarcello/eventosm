import { UpdateAbsenceStatusDto } from "./dto";

export async function changeAbsenceStatus({
  absenceId,
  status,
}: UpdateAbsenceStatusDto) {
  const currentStatus = await prisma.eventAbsences.findUnique({
    where: { id: absenceId },
    select: { status: true },
  });

  if (!currentStatus) {
    throw "Absence not found";
  }

  await prisma.eventAbsences.update({
    where: { id: absenceId },
    data: {
      status,
      registration: {
        update: {
          unjustifiedAbsences: {
            increment: status === "denied" ? 1 : -1,
          },
          justifiedAbsences: {
            increment: status === "approved" ? 1 : -1,
          },
        },
      },
    },
  });

  if (currentStatus.status === "approved") {
    throw "Cannot change status of an approved absence";
  }

  return await prisma.eventAbsences.update({
    where: { id: absenceId },
    data: { status },
  });
}
