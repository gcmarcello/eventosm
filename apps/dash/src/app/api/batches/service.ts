import { EventRegistrationBatch, Organization, Team } from "@prisma/client";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import utc from "dayjs/plugin/utc";

import timezone from "dayjs/plugin/timezone";
import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import {
  ReadRegistrationBatchDto,
  UpsertRegistrationBatchDto,
} from "@/app/api/batches/dto";
import { readTeamSize } from "@/app/api/teams/service";
import { date } from "odinkit";
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

export async function upsertRegistrationBatch(
  request: UpsertRegistrationBatchDto & {
    userSession: UserSession;
    organization: Organization;
  }
) {
  const { organization, userSession, categoryBatch, ...rest } = request;
  if (
    !dayjs(rest.dateStart, "DD/MM/YYYY HH:mm").isValid() ||
    !dayjs(rest.dateEnd, "DD/MM/YYYY HH:mm").isValid()
  )
    throw "Formato de data inválido";

  if (!request.protectedBatch) {
    await verifyConflictingBatches(
      request.eventGroupId
        ? { batch: rest, eventGroupId: rest.eventGroupId }
        : { batch: rest, eventId: rest.eventId }
    );
  }

  rest.id = rest.id ?? crypto.randomUUID();

  const { timeStart, timeEnd, ...parsedData } = rest;

  if (
    dayjs(rest.dateStart, "DD/MM/YYYY HH:mm").isAfter(
      dayjs(rest.dateEnd, "DD/MM/YYYY HH:mm")
    )
  ) {
    throw "Dia de início não pode ser depois que o dia de término.";
  }

  const upsertedBatch = await prisma.eventRegistrationBatch.upsert({
    where: { id: rest.id },
    update: {
      ...parsedData,
      price: Number(rest.price.replace(",", ".")),
      dateStart: dayjs(rest.dateStart, "DD/MM/YYYY HH:mm")
        .tz("America/Sao_Paulo", true)
        .toISOString(),
      dateEnd: dayjs(rest.dateEnd, "DD/MM/YYYY HH:mm")
        .tz("America/Sao_Paulo", true)
        .toISOString(),
    },
    create: {
      ...parsedData,
      price: Number(rest.price.replace(",", ".")),
      dateStart: dayjs(rest.dateStart, "DD/MM/YYYY HH:mm")
        .tz("America/Sao_Paulo", true)
        .toISOString(),
      dateEnd: dayjs(rest.dateEnd, "DD/MM/YYYY HH:mm")
        .tz("America/Sao_Paulo", true)
        .toISOString(),
    },
  });

  if (categoryBatch?.length && rest.id) {
    const totalSlots = categoryBatch.reduce(
      (acc, cb) =>
        (typeof cb.maxRegistrations === "number" ? cb.maxRegistrations : 0) +
        acc,
      0
    );

    if (totalSlots > rest.maxRegistrations && rest.categoryControl)
      throw "O número de vagas das categorias não pode ser maior que o número de vagas do lote de inscrição.";
    await prisma.$transaction(
      categoryBatch?.map((cb) => {
        const id = cb.id ?? crypto.randomUUID();
        return prisma.categoryBatch.upsert({
          where: { id, batchId: rest.id },
          update: {
            ...cb,

            price: cb.price ? Number(cb.price.replace(",", ".")) : null,
          },

          create: {
            ...cb,
            id,
            batchId: rest.id!,
            price: cb.price ? Number(cb.price.replace(",", ".")) : null,
          },
        });
      })
    );
  }
  return upsertedBatch;
}

export async function readRegistrationBatches(
  request: ReadRegistrationBatchDto
) {
  return await prisma.eventRegistrationBatch.findMany({
    where: request.where,
    include: {
      CategoryBatch: { include: { category: true } },
      _count: {
        select: {
          EventRegistration: { where: { status: { not: "cancelled" } } },
        },
      },
    },
  });
}

export async function verifyBatchDisponibility({
  batch,
  categoryId,
  team,
}: {
  batch: EventRegistrationBatchesWithCategories;
  categoryId: string;
  team?: Team | null;
}) {
  const teamSize = team ? await readTeamSize({ teamId: team.id }) : 1;

  if (!batch) throw "Lote de inscrição não encontrado";

  const batchRegistrations = await prisma.eventRegistration.count({
    where: { batchId: batch.id },
  });

  const today = dayjs();

  if (today.isBefore(dayjs(batch?.dateStart)))
    throw "Lote de inscrição ainda não está disponível";

  if (today.isAfter(dayjs(batch?.dateEnd))) throw "Lote de inscrição expirado";

  const potentialCategoryBatch = batch?.CategoryBatch.find(
    (cb) => cb.categoryId === categoryId
  );

  if (potentialCategoryBatch?.maxRegistrations) {
    const findCategoryBatchRegistrations = await prisma.eventRegistration.count(
      {
        where: { batchId: batch.id, categoryId, status: { not: "cancelled" } },
      }
    );
    if (
      findCategoryBatchRegistrations + teamSize >
      potentialCategoryBatch.maxRegistrations
    )
      throw `Apenas mais ${
        potentialCategoryBatch.maxRegistrations - findCategoryBatchRegistrations
      } vagas disponíveis`;
  }

  if (
    batch.maxRegistrations &&
    batchRegistrations + teamSize > batch.maxRegistrations
  )
    throw `Apenas mais ${batch.maxRegistrations - batchRegistrations} vagas disponíveis`;
}

export async function verifyConflictingBatches({
  batch,
  eventId,
  eventGroupId,
}: {
  batch: UpsertRegistrationBatchDto;
  eventId?: string;
  eventGroupId?: string;
}) {
  const potentialConflictingBatches =
    await prisma.eventRegistrationBatch.findMany({
      where: eventGroupId
        ? { eventGroupId, protectedBatch: false }
        : { eventId, protectedBatch: false },
    });

  if (!potentialConflictingBatches.length) return false;

  for (const potentialConflictingBatch of potentialConflictingBatches) {
    if (
      dayjs(potentialConflictingBatch.dateStart).isSameOrBefore(
        dayjs(batch.dateEnd, "DD/MM/YYYY HH:mm")
          .tz("America/Sao_Paulo", true)
          .toISOString()
      ) &&
      dayjs(potentialConflictingBatch.dateEnd).isSameOrAfter(
        dayjs(batch.dateStart, "DD/MM/YYYY HH:mm")
          .tz("America/Sao_Paulo", true)
          .toISOString()
      ) &&
      potentialConflictingBatch.id !== batch.id
    )
      throw `O lote de inscrição conflita com o lote de inscrição ${date(potentialConflictingBatch.dateStart, "DD/MM/YYYY HH:mm")} - ${date(potentialConflictingBatch.dateEnd, "DD/MM/YYYY HH:mm")}`;
  }
}

export async function readActiveBatch(request: ReadRegistrationBatchDto) {
  const today = dayjs().toISOString();
  const batch = await prisma.eventRegistrationBatch.findFirst({
    where: {
      dateStart: { lte: today },
      dateEnd: { gte: today },
      protectedBatch: false,
      AND: {
        OR: [
          { eventId: request.where?.eventId },
          { eventGroupId: request.where?.eventGroupId },
        ],
      },
    },
    include: {
      CategoryBatch: { include: { category: true } },
      _count: {
        select: {
          EventRegistration: { where: { status: { not: "cancelled" } } },
        },
      },
    },
  });

  if (
    batch?.maxRegistrations &&
    batch._count.EventRegistration >= batch.maxRegistrations
  )
    return null;

  return batch;
}

export async function readProtectedBatch(request: ReadRegistrationBatchDto) {
  const today = dayjs();
  const batch = await prisma.eventRegistrationBatch
    .findUniqueOrThrow({
      where: {
        dateStart: { lte: today.toISOString() },
        dateEnd: { gte: today.toISOString() },
        protectedBatch: true,
        id: request.where?.id,
      },
      include: {
        CategoryBatch: { include: { category: true } },
        _count: {
          select: { EventRegistration: true },
        },
      },
    })
    .catch(() => {
      return null;
    });

  if (
    batch?.maxRegistrations &&
    batch._count.EventRegistration >= batch.maxRegistrations
  )
    return null;
  return batch;
}

export async function readNextBatch(request: ReadRegistrationBatchDto) {
  const today = dayjs(); //@ TODO;
  const batch = await prisma.eventRegistrationBatch.findFirst({
    where: {
      dateStart: { gt: today.toISOString() },
      protectedBatch: false,
      AND: {
        OR: [
          { eventId: request.where?.eventId },
          { eventGroupId: request.where?.eventGroupId },
        ],
      },
    },
    include: {
      CategoryBatch: { include: { category: true } },
      _count: {
        select: { EventRegistration: true },
      },
    },
  });
  return batch;
}
