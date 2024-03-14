import { SubeventEventGroupCheckinDto } from "./dto";

export async function eventGroupSubeventCheckin(
  data: SubeventEventGroupCheckinDto
) {
  const existingCheckin = await prisma.eventCheckIn.findFirst({
    where: {
      registrationId: data.registrationId,
      eventId: data.subeventId,
    },
  });

  if (existingCheckin) return { checkIn: existingCheckin, existing: true };

  if (data.confirm) {
    const newCheckin = await prisma.eventCheckIn.create({
      data: {
        eventId: data.subeventId,
        registrationId: data.registrationId,
      },
    });

    return newCheckin;
  }

  return await prisma.eventRegistration.findUnique({
    where: { id: data.registrationId },
    include: {
      user: { select: { fullName: true, document: true } },
      category: true,
    },
  });
}
