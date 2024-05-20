import { UserSession } from "@/middleware/functions/userSession.middleware";
import {
  ConnectRegistrationToTeamDto,
  ReadRegistrationsDto,
  UpdateRegistrationDto,
} from "./dto";
import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import {
  CategoryBatch,
  EventAddon,
  EventRegistrationStatus,
  ModalityBatch,
} from "@prisma/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { cancelPayment } from "../payments/service";

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

  if (updatedRegistration.paymentId && request.status === "cancelled") {
    await cancelPayment(updatedRegistration.paymentId);
  }

  if (!updatedRegistration) throw "Erro ao atualizar inscrição.";
  return updatedRegistration;
}

export function readRegistrationPrice({
  batch,
  modalityId,
  categoryId,
  addon,
}: {
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations;
  addon?: EventAddon | null;
  modalityId: string;
  categoryId: string;
}) {
  let totalPrice = 0;
  if (!batch) throw "Lote de inscrição não encontrado";

  if (addon) totalPrice += addon.price;

  if (batch.categoryControl) {
    const categoryBatch = batch.CategoryBatch.find(
      (c) => c.categoryId === categoryId
    );
    if (categoryBatch) return (totalPrice += categoryBatch.price ?? 0);
  }

  if (batch.modalityControl) {
    const modalityBatch = batch.ModalityBatch.find(
      (m) => m.modalityId === modalityId
    );
    if (modalityBatch) return (totalPrice += modalityBatch.price ?? 0);
  }

  return (totalPrice += batch.price);
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
      status: data.status,
      code: data.code,
      justifiedAbsences: data.justifiedAbsences,
      unjustifiedAbsences: data.unjustifiedAbsences,
    },
  });

  return {
    eventGroup: findRegistration.eventGroup,
    registration: updatedRegistration,
  };
}
