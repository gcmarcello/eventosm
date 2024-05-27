import { UserSession } from "@/middleware/functions/userSession.middleware";
import {
  ConnectRegistrationToTeamDto,
  ReadRegistrationsDto,
  UpdateRegistrationDto,
} from "./dto";
import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import { EventRegistrationStatus, Organization } from "@prisma/client";
import { sendEmail } from "../emails/service";
import { getServerEnv } from "../env";
import { chooseTextColor } from "@/utils/colors";

export async function readRegistrations(request: ReadRegistrationsDto) {
  if (request.where?.organizationId) {
    const { organizationId, ...where } = request.where;
    const registrations = await prisma.eventRegistration.findMany({
      where: where,
      include: {
        team: true,
        event: { where: { organizationId } },
        eventGroup: {
          where: { organizationId },
          include: { Event: { orderBy: { dateStart: "asc" } } },
        },
        modality: true,
        category: true,
      },
    });
    return registrations;
  }
  return await prisma.eventRegistration.findMany({
    where: request.where,
    include: {
      event: {
        where: {
          organizationId: request.where?.organizationId,
          NOT: { status: "cancelled" },
        },
      },
      eventGroup: {
        where: {
          organizationId: request.where?.organizationId,
          NOT: { status: "cancelled" },
        },
        include: { Event: { orderBy: { dateStart: "asc" } } },
      },
    },
  });
}

export async function updateRegistrationStatus(request: {
  registrationId: string;
  userSession: UserSession;
  status: EventRegistrationStatus;
}) {
  const updatedRegistration = await prisma.eventRegistration.update({
    where: { id: request.registrationId, userId: request.userSession.id },
    data: { status: request.status },
  });

  if (!updatedRegistration) throw "Erro ao atualizar inscrição.";
  return updatedRegistration;
}

export async function readRegistrationPrice({
  batch,
  categoryId,
  coupon,
}: {
  batch: EventRegistrationBatchesWithCategories;
  categoryId: string;
  coupon?: string;
}) {
  if (!batch) throw "Lote de inscrição não encontrado";

  const category = batch?.CategoryBatch.find(
    (cb) => cb.categoryId === categoryId
  );

  if (category && category.price) return category.price;
  return batch.price || 0;
}

export async function connectRegistrationToTeam(
  data: ConnectRegistrationToTeamDto & { userSession: UserSession }
) {
  const registration = await prisma.eventRegistration.findFirst({
    where: { id: data.registrationId, userId: data.userSession.id },
  });

  if (!registration) throw "Inscrição não encontrada.";
  if (registration.teamId) throw "Inscrição já está conectada a um time.";

  return await prisma.eventRegistration.update({
    where: { id: data.registrationId },
    data: { teamId: data.teamId },
    include: { team: true },
  });
}

export async function updateEventGroupRegistration(
  data: UpdateRegistrationDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  // Query that finds a registration by its ID and includes the event group registrations so it can used to check if the code is already in use
  const findRegistration = await prisma.eventRegistration.findUnique({
    where: { id: data.registrationId },
    include: {
      eventGroup: {
        include: {
          EventRegistration: true,
        },
      },
      user: true,
    },
  });

  if (!findRegistration) throw "Inscrição não encontrada.";
  if (
    findRegistration.eventGroup?.EventRegistration.find(
      (reg) => reg.code === data.code
    ) &&
    findRegistration.code !== data.code
  )
    throw "Código já utilizado por outro participante.";

  const updatedRegistration = await prisma.eventRegistration.update({
    where: { id: data.registrationId },
    data: {
      modalityId: data.modalityId,
      categoryId: data.categoryId,
      status: data.status,
      code: data.code,
      justifiedAbsences: data.justifiedAbsences,
      unjustifiedAbsences: data.unjustifiedAbsences,
      additionalInfo: data.additionalInfo,
    },
  });

  if (
    updatedRegistration.status === "suspended" &&
    findRegistration.status !== "suspended"
  ) {
    const customDomain = await prisma.orgCustomDomain.findFirst({
      where: { organizationId: data.organization?.id },
    });
    const url = customDomain
      ? "https://" + customDomain.domain
      : process.env.NEXT_PUBLIC_SITE_URL;
    await sendEmail([
      {
        template: "registration_suspended",
        setup: {
          from: getServerEnv("SENDGRID_EMAIL")!,
          subject: `Inscrição Suspensa/Eliminação - ${findRegistration.eventGroup?.name}`,
          to: findRegistration.user.email,
        },
        templateParameters: {
          headerTextColor: chooseTextColor(
            data.organization?.options.colors.primaryColor.hex || "#4F46E5"
          ),
          eventName: findRegistration.eventGroup?.name,
          mainColor:
            data.organization?.options.colors.primaryColor.hex || "#4F46E5",
          orgName: data.organization?.name || "EventoSM",
          name: findRegistration.user.fullName.split(" ")[0] as string,
          siteLink: `${url}`,
          suspensionReason: data.additionalInfo?.suspensionReason,
        },
      },
    ]);
  }

  return {
    eventGroup: findRegistration.eventGroup,
    registration: updatedRegistration,
  };
}
