import { UserSession } from "@/middleware/functions/userSession.middleware";
import { Organization } from "@prisma/client";
import { UpdateEventStatusDto } from "../dto";
import dayjs from "dayjs";
import { isNumber } from "lodash";

async function updateEventStatusToReview(data: {
  eventId: string;
  eventGroupId?: string;
  userSession: UserSession;
  organization: Organization;
}) {
  if (data.eventGroupId) {
    const onReviewEvents = await prisma.event.findMany({
      where: { eventGroupId: data.eventGroupId, status: "review" },
    });

    if (onReviewEvents.length > 0) {
      throw "Finalize o evento em andamento antes de analisar outro.";
    }
  }

  const rules = await prisma.eventGroupRules.findUniqueOrThrow({
    where: {
      eventGroupId: data.eventGroupId,
    },
  }); // @todo

  const eventRegistrations = await prisma.eventRegistration.findMany({
    where: {
      status: {
        not: { in: ["cancelled", "suspended"] },
      },
      ...(data.eventGroupId
        ? { eventGroupId: data.eventGroupId }
        : { eventId: data.eventId }),
    },
  });

  if (eventRegistrations.length === 0)
    throw "Não é possível analisar um evento sem inscrições.";

  const eventCheckins = await prisma.eventCheckIn.findMany({
    where: { eventId: data.eventId },
  });

  const absentRegistrations = eventRegistrations
    .filter(
      (registration) =>
        !eventCheckins.find(
          (checkin) => checkin.registrationId === registration.id
        )
    )
    .map((r) => {
      const shouldCancel =
        (rules.unjustifiedAbsences &&
          r.unjustifiedAbsences > rules.unjustifiedAbsences) ||
        (rules.justifiedAbsences &&
          r.justifiedAbsences + 1 > rules.justifiedAbsences);

      return {
        ...r,
        status: shouldCancel ? "suspended" : r.status,
        unjustifiedAbsences: r.unjustifiedAbsences + 1,
      };
    });

  await prisma.$transaction([
    ...absentRegistrations.map((r) =>
      prisma.eventRegistration.update({
        where: {
          id: r.id,
        },
        data: r,
      })
    ),

    prisma.eventAbsences.createMany({
      data: absentRegistrations.map((absence) => ({
        eventId: data.eventId,
        registrationId: absence.id,
        status: "pending",
      })),
    }),

    prisma.event.update({
      where: {
        id: data.eventId,
      },
      data: { status: "review" },
    }),
  ]);

  return { message: "Evento colocado em análise." };
}

async function updateEventStatusToFinished(data: {
  eventId: string;
  eventGroupId?: string;
  userSession: UserSession;
  organization: Organization;
}) {
  const onReviewEvent = await prisma.event.findUnique({
    where: { id: data.eventId, status: "review" },
  });

  if (!onReviewEvent) {
    throw "O evento precisa estar em analise para ser finalizado";
  }

  const absences = await prisma.eventAbsences.findMany({
    where: {
      eventId: data.eventId,
      status: {
        not: {
          equals: "approved",
        },
      },
    },
  });

  const pendingAbsences = absences.filter(
    (absence) => absence.status === "pending"
  );

  if (pendingAbsences.length > 0) {
    throw "Existem faltas pendentes.";
  }

  const deniedAbsences = await prisma.eventAbsences.findMany({
    where: { eventId: data.eventId, status: "denied" },
    include: {
      registration: true,
    },
  });

  const rules = await prisma.eventGroupRules.findUniqueOrThrow({
    where: {
      eventGroupId: data.eventGroupId,
    },
  });

  const maxUnjustifiedAbsences = rules.unjustifiedAbsences;

  const absentRegistrations = deniedAbsences.map((absence) => {
    const registration = absence.registration;
    const unjustifiedAbsences = registration.unjustifiedAbsences;

    const shouldCancel =
      isNumber(maxUnjustifiedAbsences) &&
      unjustifiedAbsences > maxUnjustifiedAbsences;

    return {
      ...registration,
      status: shouldCancel ? "suspended" : registration.status,
      unjustifiedAbsences,
    };
  });

  await prisma.$transaction([
    ...absentRegistrations.map((r) =>
      prisma.eventRegistration.update({
        where: {
          id: r.id,
        },
        data: r,
      })
    ),

    prisma.event.update({
      where: {
        id: data.eventId,
      },
      data: { status: "finished" },
    }),
  ]);

  return { message: "Evento finalizado." };
}

async function updateEventStatusToDraft(data: { eventId: string }) {
  await prisma.event.update({
    where: {
      id: data.eventId,
    },
    data: { status: "draft" },
  });

  return { message: "Evento voltado para rascunho." };
}

async function updateEventStatusToPublished(data: { eventId: string }) {
  await prisma.event.update({
    where: {
      id: data.eventId,
    },
    data: { status: "published" },
  });

  return { message: "Evento publicado!" };
}

export async function updateEventStatus({
  status,
  eventId,
  eventGroupId,
  userSession,
  organization,
}: UpdateEventStatusDto & {
  userSession: UserSession;
  organization: Organization;
}) {
  if (!eventId) throw "ID do evento é obrigatório.";
  const args = { eventId, eventGroupId, userSession, organization };
  switch (status) {
    case "review":
      return updateEventStatusToReview(args);
    case "finished":
      return updateEventStatusToFinished(args);
    case "draft":
      return updateEventStatusToDraft({ eventId });
    case "published":
      return updateEventStatusToPublished({ eventId });
  }
  return { message: "Status do evento atualizado." };
}
