import { UserSession } from "@/middleware/functions/userSession.middleware";
import { CreateAbsenceJustificationDto, UpdateAbsenceStatusDto } from "./dto";
import { getPreSignedURL } from "../uploads/service";
import { sendEmail } from "../emails/service";
import { getServerEnv } from "../env";
import { chooseTextColor } from "@/utils/colors";
import { Organization } from "@prisma/client";

export async function changeAbsenceStatus(
  data: UpdateAbsenceStatusDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  const currentStatus = await prisma.eventAbsences.findUnique({
    where: { id: data.absenceId },
    select: {
      status: true,
      justificationUrl: true,
      event: {
        include: { Organization: { include: { OrgCustomDomain: true } } },
      },
      registration: { select: { user: true } },
    },
  });

  if (!currentStatus) {
    throw "Absence not found";
  }

  if (currentStatus.status === "approved") {
    throw "Cannot change status of an approved absence";
  }

  const url = currentStatus.event.Organization?.OrgCustomDomain[0]?.domain
    ? "https://" + currentStatus.event.Organization?.OrgCustomDomain[0]?.domain
    : process.env.NEXT_PUBLIC_SITE_URL;

  await sendEmail([
    {
      template:
        currentStatus.status === "denied"
          ? "justification_denied"
          : "justification_accepted",
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: `Justificativa Aceita - ${currentStatus.event.name}`,
        to: currentStatus.registration.user.email,
      },
      templateParameters: {
        headerTextColor: chooseTextColor(
          data.organization?.options.colors.primaryColor.hex || "#4F46E5"
        ),
        eventName: currentStatus.event.name,
        mainColor:
          data.organization?.options.colors.primaryColor.hex || "#4F46E5",
        orgName: data.organization?.name || "EventoSM",
        name: currentStatus.registration.user.fullName.split(" ")[0] as string,
        siteLink: `${url}/confirmar/${currentStatus.registration.user.id}`,
      },
    },
  ]);

  await prisma.eventAbsences.update({
    where: { id: data.absenceId },
    data: {
      status: data.status,
      justificationUrl:
        data.status === "denied" ? null : currentStatus.justificationUrl,
      registration: {
        update: {
          unjustifiedAbsences: {
            increment: data.status === "denied" ? 0 : -1,
          },
          justifiedAbsences: {
            increment: data.status === "approved" ? 1 : 0,
          },
        },
      },
    },
  });

  return await prisma.eventAbsences.update({
    where: { id: data.absenceId },
    data: { status: data.status },
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

export async function changeMultipleAbsencesStatus({
  registrationIds,
  status,
}: {
  registrationIds: string[];
  status: "approved" | "denied";
}) {
  await prisma.$transaction([
    prisma.eventAbsences.updateMany({
      where: {
        registrationId: {
          in: registrationIds,
        },
        status: "pending",
      },
      data: {
        status,
      },
    }),
    ...registrationIds.map((id) =>
      prisma.eventRegistration.update({
        where: { id },
        data: {
          unjustifiedAbsences: {
            increment: status === "denied" ? 0 : -1,
          },
          justifiedAbsences: {
            increment: status === "approved" ? 1 : 0,
          },
        },
      })
    ),
  ]);
}
