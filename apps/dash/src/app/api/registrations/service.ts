import { UserSession } from "@/middleware/functions/userSession.middleware";
import {
  ConnectRegistrationToTeamDto,
  ReadRegistrationsDto,
  UpdateRegistrationDto,
} from "./dto";
import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import { EventRegistrationStatus } from "@prisma/client";

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
      event: true,
      eventGroup: { include: { Event: { orderBy: { dateStart: "asc" } } } },
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
  data: UpdateRegistrationDto
) {
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
      code: data.code,
    },
  });

  return {
    eventGroup: findRegistration.eventGroup,
    registration: updatedRegistration,
  };
}
