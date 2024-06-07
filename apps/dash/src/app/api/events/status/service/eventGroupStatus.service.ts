import { UserSession } from "@/middleware/functions/userSession.middleware";
import { Organization } from "@prisma/client";
import { UpdateEventGroupStatusDto } from "../dto";

async function updateEventGroupStatusToDraft(data: { eventGroupId: string }) {
  return await prisma.eventGroup.update({
    where: {
      id: data.eventGroupId,
    },
    data: { status: "draft" },
  });
}

async function updateEventGroupStatusToPublished(data: {
  eventGroupId: string;
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: data.eventGroupId },
    include: {
      Event: true,
      EventModality: { include: { modalityCategory: true } },
      EventRegistrationBatch: true,
    },
  });
  if (!eventGroup) throw "Grupo de eventos não encontrado.";
  if (eventGroup.Event.length === 0)
    throw "O grupo de eventos não possui etapas cadastradas.";
  if (eventGroup.EventModality.length === 0)
    throw "O grupo de eventos não possui modalidades cadastradas.";
  if (
    eventGroup.EventModality.every(
      (modality) => !modality.modalityCategory?.length
    )
  )
    throw "Nenhuma modalidade tem uma categoria cadastrada.";

  return await prisma.eventGroup.update({
    where: {
      id: data.eventGroupId,
    },
    data: { status: "published" },
  });
}

async function updateEventGroupStatusToReview(data: {
  eventGroupId: string;
  userSession: UserSession;
  organization: Organization;
}) {
  return await prisma.eventGroup.update({
    where: {
      id: data.eventGroupId,
    },
    data: { status: "review" },
  });
}

export async function updateEventGroupStatus({
  status,
  eventGroupId,
  userSession,
  organization,
}: UpdateEventGroupStatusDto & {
  userSession: UserSession;
  organization: Organization;
}) {
  if (!eventGroupId) throw "ID do evento é obrigatório.";
  const args = { eventGroupId, userSession, organization };
  switch (status) {
    case "review":
      return updateEventGroupStatusToReview(args);
    case "draft":
      return updateEventGroupStatusToDraft(args);
    case "published":
      return updateEventGroupStatusToPublished(args);
  }
}
