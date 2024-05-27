import { UserSession } from "@/middleware/functions/userSession.middleware";
import { Organization } from "@prisma/client";
import { UpdateEventStatusDto } from "../dto";
import dayjs from "dayjs";
import { isNumber } from "lodash";
import { changeMultipleAbsencesStatus } from "@/app/api/absences/service";
import { sendEmail } from "@/app/api/emails/service";
import { getServerEnv } from "@/app/api/env";
import { chooseTextColor } from "@/utils/colors";
import { Email, EmailTemplate } from "email-templates";

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
    include: { user: { select: { email: true, fullName: true } } },
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

  if (absentRegistrations.filter((r) => r.status === "active").length > 0) {
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
      include: { Organization: { include: { OrgCustomDomain: true } } },
    });

    if (!event) throw "Evento não encontrado.";

    const url = event.Organization?.OrgCustomDomain[0]?.domain
      ? "https://" + event.Organization?.OrgCustomDomain[0]?.domain
      : process.env.NEXT_PUBLIC_SITE_URL;

    const emailArray: Email<"justification_needed">[] = absentRegistrations
      .filter((r) => r.status === "active")
      .map((r) => ({
        template: "justification_needed",
        setup: {
          from: getServerEnv("SENDGRID_EMAIL")!,
          subject: `Ausência em ${event.name}`,
          to: r.user.email,
        },
        templateParameters: {
          headerTextColor: chooseTextColor(
            data.organization?.options.colors.primaryColor.hex || "#4F46E5"
          ),
          eventName: event.name,
          mainColor:
            data.organization?.options.colors.primaryColor.hex || "#4F46E5",
          orgName: data.organization?.name || "EventoSM",
          name: r.user.fullName.split(" ")[0] as string,
          siteLink: `${url}`,
        },
      }));
    try {
      await sendEmail(emailArray);
    } catch (error) {
      throw "Erro ao enviar e-mail de justificativas." + error;
    }
  }

  await prisma.$transaction([
    ...absentRegistrations.map((r) => {
      const { user, ...rest } = r;
      return prisma.eventRegistration.update({
        where: {
          id: r.id,
        },
        data: { ...rest, additionalInfo: { ...rest.additionalInfo } },
      });
    }),

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
  finishEvent?: { unjustifiedAbsences?: "approved" | "denied" };
}) {
  const onReviewEvent = await prisma.event.findUnique({
    where: { id: data.eventId, status: "review" },
    include: { EventGroup: true },
  });

  if (!onReviewEvent) {
    throw "O evento precisa estar em analise para ser finalizado";
  }

  if (data.finishEvent?.unjustifiedAbsences) {
    const absences = await prisma.eventAbsences.findMany({
      where: {
        eventId: data.eventId,
        status: "pending",
      },
      select: {
        registration: { select: { id: true, unjustifiedAbsences: true } },
      },
    });

    await changeMultipleAbsencesStatus({
      registrationIds: absences.map((a) => a.registration.id),
      status: data.finishEvent.unjustifiedAbsences,
    });
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
    throw "Ainda existem ausências pendentes.";
  }

  const deniedAbsences = await prisma.eventAbsences.findMany({
    where: { eventId: data.eventId, status: "denied" },
    include: {
      registration: {
        include: { user: { select: { email: true, fullName: true } } },
      },
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

  const suspendedRegistrations = absentRegistrations.filter(
    (r) => r.status === "suspended"
  );

  const customDomain = await prisma.orgCustomDomain.findFirst({
    where: { organizationId: data.organization?.id },
  });
  const url = customDomain
    ? "https://" + customDomain.domain
    : process.env.NEXT_PUBLIC_SITE_URL;

  if (onReviewEvent.EventGroup && suspendedRegistrations.length > 0) {
    await sendEmail(
      suspendedRegistrations.map((r) => ({
        template: "registration_suspended",
        setup: {
          from: getServerEnv("SENDGRID_EMAIL")!,
          subject: `Inscrição Suspensa/Eliminação - ${onReviewEvent.EventGroup?.name}`,
          to: r.user.email,
        },
        templateParameters: {
          headerTextColor: chooseTextColor(
            data.organization?.options.colors.primaryColor.hex || "#4F46E5"
          ),
          eventName: onReviewEvent.EventGroup?.name,
          mainColor:
            data.organization?.options.colors.primaryColor.hex || "#4F46E5",
          orgName: data.organization?.name || "EventoSM",
          name: r.user.fullName.split(" ")[0] as string,
          siteLink: `${url}`,
          suspensionReason: "Você excedeu o limite de ausências.",
        },
      }))
    );
  }

  await prisma.$transaction([
    ...absentRegistrations.map((r) => {
      const { user, ...rest } = r;
      return prisma.eventRegistration.update({
        where: {
          id: r.id,
        },
        data: { ...rest, additionalInfo: { ...rest.additionalInfo } },
      });
    }),

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
  finishEvent,
}: UpdateEventStatusDto & {
  userSession: UserSession;
  organization: Organization;
}) {
  if (!eventId) throw "ID do evento é obrigatório.";
  const args = {
    eventId,
    eventGroupId,
    userSession,
    organization,
    finishEvent,
  };
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
