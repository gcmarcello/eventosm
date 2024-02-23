import { UserSession } from "@/middleware/functions/userSession.middleware";
import { uploadFile } from "../uploads/service";
import { prisma } from "prisma/prisma";
import {
  ReadEventDto,
  ReadEventGroupDto,
  ReadEventModalitiesDto,
  ReadEventTypeDto,
  UpdateEventStatusDto,
  UpsertEventAddonDto,
  UpsertEventDto,
  UpsertEventGroupDto,
  UpsertEventModalityCategoriesDto,
  UpsertEventModalityDto,
  UpsertEventTypeDto,
} from "./dto";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EventModalityWithCategories } from "prisma/types/Events";
import { Organization } from "@prisma/client";
dayjs.extend(customParseFormat);

/* export async function upsertEventGroupType(request: UpsertEventGroupTypeDto) {
  const newEventType = await prisma.eventType.create({
    data: request,
  });

  return newEventType;
} */

export async function upsertEvent(
  request: UpsertEventDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  const { userSession, ...rest } = request;
  let newImage;

  const id = rest.id ?? crypto.randomUUID();
  const dateStart = dayjs(rest.dateStart, "DD/MM/YYYY").toISOString();
  const dateEnd = dayjs(rest.dateEnd, "DD/MM/YYYY").toISOString();

  const newEvent = await prisma.event.upsert({
    where: { id },
    update: {
      ...rest,
      dateStart,
      dateEnd,
    },
    create: {
      ...rest,
      slug: rest.slug || id,
      organizationId: request.organization.id,
      dateStart,
      dateEnd,
      status: rest.eventGroupId ? "published" : "draft",
    },
  });

  return newEvent;
}

export async function upsertEventGroup(
  request: UpsertEventGroupDto & {
    userSession: UserSession;
    organization: Organization;
  }
) {
  const { ruleLogic, userSession, organization, ...event } = request;
  const id = event.id ?? crypto.randomUUID();
  const newEventGroup = await prisma.eventGroup.upsert({
    where: { id: id },
    update: {
      ...event,
      slug: event.slug || id,
    },
    create: {
      ...event,
      slug: event.slug || id,
      organizationId: organization.id,
    },
  });

  if (newEventGroup.eventGroupType === "free") return newEventGroup;

  if (ruleLogic) {
    const newRules = await prisma.eventGroupRules.upsert({
      where: { eventGroupId: id },
      update: {
        ...ruleLogic,
      },
      create: {
        ...ruleLogic,
        eventGroupId: newEventGroup.id,
      },
    });
    return { newEventGroup, rules: newRules };
  }

  return { newEventGroup };
}

export async function upsertEventModality(
  request: UpsertEventModalityDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  let event;
  const { organization, userSession, ...rest } = request;
  request.id = request.id ?? crypto.randomUUID();

  if (request.eventId) {
    event = await prisma.event.findFirst({
      where: { id: request.eventId, organizationId: organization.id },
    });
  } else {
    event = await prisma.eventGroup.findFirst({
      where: { id: request.eventGroupId, organizationId: organization.id },
    });
  }

  if (!event) throw "Evento não encontrado nessa organização.";

  const newEventModality = await prisma.eventModality.upsert({
    where: { id: request.id },
    update: {
      ...rest,
    },
    create: {
      ...rest,
    },
  });

  return newEventModality;
}

export async function upsertEventAddon(
  request: UpsertEventAddonDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  const { organization, userSession, ...rest } = request;

  const event = await prisma.event.findFirst({
    where: { id: request.id, organizationId: organization.id },
    include: { EventAddon: true },
  });
  if (!event) throw "Evento não encontrado nessa organização.";

  let newImage = event.EventAddon.find(
    (addon) => addon.id === request.id
  )?.image;

  if (request.image) {
    const uploadedImage = await uploadFile(
      request.image,
      `events/${event.slug}/${request.image.name}`
    );

    if (!uploadedImage) {
      throw "Erro ao fazer upload da imagem";
    }

    newImage = uploadedImage;
  }

  const newEventAddon = await prisma.eventAddon.upsert({
    where: { id: request.id },
    update: {
      ...rest,
      image: newImage,
    },
    create: {
      ...rest,
      image: newImage,
    },
  });

  return newEventAddon;
}

export async function readEvents(request: ReadEventDto) {
  const events = await prisma.event.findMany({
    where: request.where,
    include: {
      _count: { select: { EventRegistration: true } },
      EventModality: { include: { modalityCategory: true } },
      EventRegistration: true,
      EventRegistrationBatch: {
        include: { _count: { select: { EventRegistration: true } } },
      },
    },
  });

  return events;
}

export async function readEventGroups(request: ReadEventGroupDto) {
  const events = await prisma.eventGroup.findMany({
    where: request.where,
    include: {
      Event: true,
      EventGroupRules: true,
      EventRegistration: { include: { user: true } },
      EventModality: { include: { modalityCategory: true } },
      EventAddon: true,
      EventRegistrationBatch: {
        include: { _count: { select: { EventRegistration: true } } },
      },
    },
  });

  return events;
}

export async function readEventModalities(request: ReadEventModalitiesDto) {
  const eventModalities = await prisma.eventModality.findMany({
    where: request.where,
    include: { modalityCategory: true },
    orderBy: { createdAt: "asc" },
  });

  return eventModalities;
}

export async function deleteModality(
  request: { id: string } & {
    userSession: UserSession;
    organization: Organization;
  }
) {
  const modality = await prisma.eventModality.update({
    where: { id: request.id },
    data: { deletedAt: dayjs().toISOString() },
  });

  if (!modality) throw "Modalidade não encontrada.";

  await prisma.eventModality.delete({ where: { id: request.id } });

  return modality;
}

export async function updateEventStatus(
  request: UpdateEventStatusDto & {
    userSession: UserSession;
    organization: Organization;
  }
) {
  if (!request.id && !request.groupId) throw "Evento não encontrado.";

  if (request.id) {
    const eventToUpdate = await prisma.event.findFirst({
      where: { id: request.id, organizationId: request.organization.id },
      include: { EventModality: true, EventRegistrationBatch: true },
    });
    if (!eventToUpdate) throw "Evento não encontrado na organização.";
    if (!eventToUpdate.EventModality.length) throw "Evento sem modalidades.";
    if (!eventToUpdate.EventRegistrationBatch.length)
      throw "Evento sem lotes de inscrição.";
  } else {
    const groupToUpdate = await prisma.eventGroup.findFirst({
      where: { id: request.id, organizationId: request.organization.id },
      include: {
        EventModality: true,
        EventRegistrationBatch: true,
        Event: true,
      },
    });
    if (!groupToUpdate) throw "Grupo não encontrado na organização.";
    if (!groupToUpdate.Event.length) throw "Grupo sem etapas associadas.";
    if (!groupToUpdate.EventModality.length) throw "Grupo sem modalidades.";
    if (!groupToUpdate.EventRegistrationBatch.length)
      throw "Grupo sem lotes de inscrição.";
  }

  const updatedEventOrGroup = request.id
    ? await prisma.event.update({
        where: {
          id: request.id,
          Organization: {
            id: request.organization.id,
            ownerId: request.userSession.id,
          },
        },
        data: { status: request.status },
      })
    : await prisma.eventGroup.update({
        where: {
          id: request.groupId,
          Organization: {
            id: request.organization.id,
            ownerId: request.userSession.id,
          },
        },
        data: { status: request.status },
      });

  return updatedEventOrGroup;
}
