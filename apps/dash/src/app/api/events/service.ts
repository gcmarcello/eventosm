import { UserSession } from "@/middleware/functions/userSession.middleware";
import { uploadFile } from "../uploads/service";
import prisma from "prisma/prisma";
import {
  ReadEventDto,
  ReadEventGroupCheckinsAndAbsencesDto,
  ReadEventGroupDto,
  ReadEventModalitiesDto,
  ReadEventTypeDto,
  UpsertEventDto,
  UpsertEventGroupDto,
  UpsertEventGroupRulesDto,
  UpsertEventModalityDto,
  UpsertEventTypeDto,
} from "./dto";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EventModalityWithCategories } from "prisma/types/Events";
import { EventGroupRules, Organization } from "@prisma/client";
import { UpdateEventStatusDto } from "./status/dto";
import { fullTextSearch } from "odinkit";
dayjs.extend(customParseFormat);

export async function verifySlugUniqueness({
  slug,
  eventId,
}: {
  slug: string;
  eventId: string;
}) {
  const verifyEventSlugs = await prisma.event.findFirst({
    where: { AND: { slug, NOT: { id: eventId } } },
  });
  if (verifyEventSlugs)
    throw { message: `Link ${slug} já utilizado.`, field: "slug" };
  const verifyEventGroupSlugs = await prisma.eventGroup.findFirst({
    where: { AND: { slug, NOT: { id: eventId } } },
  });
  if (verifyEventGroupSlugs)
    throw { message: `Link ${slug} já utilizado.`, field: "slug" };
}

export async function upsertEvent(
  request: UpsertEventDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  const { userSession, organization, ...data } = request;
  let newImage;

  const id = data.id ?? crypto.randomUUID();
  const dateStart = dayjs(data.dateStart, "DD/MM/YYYY")
    .tz("America/Sao_Paulo", true)
    .toISOString();
  const dateEnd = dayjs(data.dateEnd, "DD/MM/YYYY")
    .tz("America/Sao_Paulo", true)
    .toISOString();

  data.slug && (await verifySlugUniqueness({ slug: data.slug, eventId: id }));

  const newEvent = await prisma.event.upsert({
    where: { id },
    update: {
      ...data,
      dateStart,
      dateEnd,
    },
    create: {
      ...data,
      slug: data.slug || id,
      organizationId: organization.id,
      dateStart,
      dateEnd,
      status: data.eventGroupId ? "published" : "draft",
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
  await verifySlugUniqueness({ slug: event.slug, eventId: id });
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
    const newRules = await upsertEventGroupRules({
      eventGroupId: newEventGroup.id,
      rules: ruleLogic,
    });
    return { ...newEventGroup, rules: newRules };
  }

  return newEventGroup;
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

export async function readEventsGalleriesByEventGroup(eventGroupId: string) {
  const events = await prisma.event.findMany({
    where: { eventGroupId },
    include: { Gallery: true },
    orderBy: { dateStart: "asc" },
  });

  return events;
}

export async function readEvents(request: ReadEventDto) {
  const events = await prisma.event.findMany({
    where: request.where,
    include: {
      _count: {
        select: { EventRegistration: { where: { status: "active" } } },
      },
      EventModality: {
        include: { modalityCategory: { include: { CategoryDocument: true } } },
      },
      EventRegistration: true,
      EventRegistrationBatch: {
        include: { _count: { select: { EventRegistration: true } } },
      },
      Gallery: true,
    },
  });

  return events;
}

export async function readEventGroups(request: ReadEventGroupDto) {
  const events = await prisma.eventGroup.findMany({
    where: request.where,
    include: {
      Event: { orderBy: { dateStart: "asc" } },
      EventGroupRules: true,
      EventRegistration: {
        include: { user: true },
      },
      EventModality: {
        include: { modalityCategory: { include: { CategoryDocument: true } } },
      },
      EventAddon: true,
      EventRegistrationBatch: {
        include: {
          _count: {
            select: {
              EventRegistration: { where: { status: { not: "cancelled" } } },
            },
          },
        },
      },
      Gallery: true,
    },
  });

  return events;
}

export async function readEventGroupCheckinsAndAbsences(
  request: ReadEventGroupCheckinsAndAbsencesDto & { userSession: UserSession }
) {
  const userData = await prisma.eventRegistration.findUnique({
    where: {
      id: request.where?.registrationId,
      userId: request.userSession.id,
    },
    include: {
      eventGroup: { include: { Event: { orderBy: { dateStart: "asc" } } } },
      EventAbsences: true,
      EventCheckIn: true,
    },
  });

  return userData;
}

export async function readSubeventReviewData(request: { eventId: string }) {
  const absences = await prisma.eventAbsences.findMany({
    where: { eventId: request.eventId },
    include: {
      registration: {
        select: { user: { select: { fullName: true, phone: true } } },
      },
    },
  });

  const checkins = await prisma.eventCheckIn.findMany({
    where: { eventId: request.eventId },
    include: {
      registration: { select: { user: { select: { fullName: true } } } },
    },
  });

  return { absences, checkins };
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
  if (!request.eventId && !request.eventGroupId) throw "Evento não encontrado.";

  if (request.eventId) {
    const eventToUpdate = await prisma.event.findFirst({
      where: { id: request.eventId, organizationId: request.organization.id },
      include: { EventModality: true, EventRegistrationBatch: true },
    });
    if (!eventToUpdate) throw "Evento não encontrado na organização.";
    if (!eventToUpdate.EventModality.length) throw "Evento sem modalidades.";
    if (!eventToUpdate.EventRegistrationBatch.length)
      throw "Evento sem lotes de inscrição.";
  } else {
    const groupToUpdate = await prisma.eventGroup.findFirst({
      where: {
        id: request.eventGroupId,
        organizationId: request.organization.id,
      },
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

  const updatedEventOrGroup = request.eventId
    ? await prisma.event.update({
        where: {
          id: request.eventId,
          Organization: {
            id: request.organization.id,
            ownerId: request.userSession.id,
          },
        },
        data: { status: request.status },
      })
    : await prisma.eventGroup.update({
        where: {
          id: request.eventGroupId,
          Organization: {
            id: request.organization.id,
            ownerId: request.userSession.id,
          },
        },
        data: { status: request.status },
      });

  return updatedEventOrGroup;
}

export async function upsertEventGroupRules({
  rules,
  eventGroupId,
}: {
  rules: UpsertEventGroupRulesDto;
  eventGroupId: string;
}) {
  const newRules = await prisma.eventGroupRules.upsert({
    where: { eventGroupId },
    update: {
      ...rules,
      discard: rules.discard ? parseInt(rules.discard) : null,
      justifiedAbsences: rules.justifiedAbsences
        ? parseInt(rules.justifiedAbsences)
        : null,
      unjustifiedAbsences: rules.unjustifiedAbsences
        ? parseInt(rules.unjustifiedAbsences)
        : null,
    },
    create: {
      ...rules,
      eventGroupId,
      discard: rules.discard ? parseInt(rules.discard) : null,
      justifiedAbsences: rules.justifiedAbsences
        ? parseInt(rules.justifiedAbsences)
        : null,
      unjustifiedAbsences: rules.unjustifiedAbsences
        ? parseInt(rules.unjustifiedAbsences)
        : null,
    },
  });
}

export async function readEventFulltext(
  request: ReadEventDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  const searchQuery = request.where?.name ? `'${request.where?.name}':*` : "";

  const query = await fullTextSearch({
    table: ["public", "Event"],
    tableAlias: "e",
    where: [`e."organizationId" = '${request.organization.id}'`],
    searchField: ["e", "name"],
    orderBy: ["e", "id"],
  });

  const locations = await prisma.$queryRawUnsafe<any[]>(query, searchQuery, 10);

  return locations;
}

export async function readEventGroupFulltext(
  request: ReadEventGroupDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  const searchQuery = request.where?.name ? `'${request.where?.name}':*` : "";

  const query = await fullTextSearch({
    table: ["public", "EventGroup"],
    tableAlias: "e",
    where: [`e."organizationId" = '${request.organization.id}'`],
    searchField: ["e", "name"],
    orderBy: ["e", "id"],
  });

  const locations = await prisma.$queryRawUnsafe<any[]>(query, searchQuery, 10);

  return locations;
}
