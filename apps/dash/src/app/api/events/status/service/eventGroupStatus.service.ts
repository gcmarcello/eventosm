import { UserSession } from "@/middleware/functions/userSession.middleware";
import { Organization } from "@prisma/client";
import { UpdateEventGroupStatusDto } from "../dto";
import prisma from "prisma/prisma";

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
  return await prisma.event.update({
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
