import { normalize } from "odinkit";
import { SubeventEventGroupCheckinDto } from "./dto";
import { UserSession } from "@/middleware/functions/userSession.middleware";

export async function readEventGroupRegistrationCheckin(
  data: SubeventEventGroupCheckinDto
) {
  if (!data.subeventId) throw "Evento não informado.";
  const eventGroup = await prisma.eventGroup.findFirst({
    where: { Event: { some: { id: data.subeventId } } },
  });

  if (!eventGroup) throw "Evento não encontrado.";

  const existingRegistration = data.document
    ? await prisma.eventRegistration.findFirst({
        where: {
          user: { document: normalize(data.document) },
          eventGroup: { Event: { some: { id: data.subeventId } } },
          status: "active",
        },
        include: { user: true, modality: true, category: true, addon: true },
      })
    : await prisma.eventRegistration.findUnique({
        where: {
          id: data.registrationId,
          eventGroup: { Event: { some: { id: data.subeventId } } },
          status: "active",
        },
        include: { user: true, modality: true, category: true, addon: true },
      });

  if (!existingRegistration) throw "Inscrição não encontrada.";

  const existingCheckin = await prisma.eventCheckIn.findFirst({
    where: {
      AND: [
        { registrationId: data.registrationId },
        { eventId: data.subeventId },
      ],
    },
  });

  const existingUserEventGroupCheckins = await prisma.event.findMany({
    where: { eventGroupId: eventGroup.id },
    include: {
      EventCheckIn: { where: { registrationId: data.registrationId } },
    },
    orderBy: { dateStart: "asc" },
  });

  if (existingCheckin) throw "Check-in da etapa já realizado!";

  return { existingRegistration, existingUserEventGroupCheckins };
}

export async function eventGroupSubeventCheckin(
  data: SubeventEventGroupCheckinDto & { userSession: UserSession }
) {
  const existingCheckin = await prisma.eventCheckIn.findFirst({
    where: {
      id: data.registrationId,
      eventId: data.subeventId,
    },
  });

  if (existingCheckin) throw "Check-in já realizado!";

  if (data.registrationId) {
    const newCheckin = await prisma.eventCheckIn.create({
      data: {
        eventId: data.subeventId,
        registrationId: data.registrationId,
        createdById: data.userSession.id,
      },
      include: { registration: { include: { user: true } } },
    });

    return { checkIn: newCheckin, status: "new" };
  }
}
