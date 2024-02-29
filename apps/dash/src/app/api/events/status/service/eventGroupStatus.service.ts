import { UserSession } from "@/middleware/functions/userSession.middleware";
import { Organization } from "@prisma/client";

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
  eventId: string;
  userSession: UserSession;
  organization: Organization;
}) {
  return await prisma.event.update({
    where: {
      id: data.eventId,
    },
    data: { status: "review" },
  });
}
