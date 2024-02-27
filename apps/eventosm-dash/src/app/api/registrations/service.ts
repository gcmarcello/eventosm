import { UserSession } from "@/middleware/functions/userSession.middleware";
import {
  CreateMultipleRegistrationsDto,
  ReadRegistrationsDto,
  UpsertRegistrationDto,
} from "./dto";
import QRCode from "qrcode";
import fs from "fs";
import sharp from "sharp";
import { createTeam, readTeamWithUsers } from "../teams/service";
import { BatchCoupon, Gender, Team } from "@prisma/client";
import { TeamWithUsers } from "prisma/types/Teams";
import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import { createOrder } from "../payments/service";
import { readCoupon } from "../coupons/service";
import {
  readModalityCategories,
  verifyCategoryDisponibility,
} from "../categories/service";
import { readActiveBatch, verifyBatchDisponibility } from "../batches/service";
import { readOrganizations } from "../orgs/service";
import { readEventGroups, readEvents } from "../events/service";
import { readAddressFromZipCode } from "../geo/service";
import { id_ID } from "@faker-js/faker";
import dayjs from "dayjs";
import { formatCPF } from "odinkit";
import { uploadFile } from "../uploads/service";

export async function readRegistrations(request: ReadRegistrationsDto) {
  if (request.where?.organizationId) {
    const { organizationId, ...where } = request.where;
    const registrations = await prisma.eventRegistration.findMany({
      where: where,
      include: {
        event: { where: { organizationId } },
        eventGroup: { where: { organizationId }, include: { Event: true } },
        modality: true,
        category: true,
      },
    });
    return registrations;
  }
  return await prisma.eventRegistration.findMany({
    where: request.where,
    include: { event: true, eventGroup: { include: { Event: true } } },
  });
}

export async function createRegistration(
  request: UpsertRegistrationDto & { userSession: UserSession }
) {
  const { userSession, acceptedTerms, addon, ...registration } = request;

  const registrationId = crypto.randomUUID();

  if (!registration.eventId && !registration.eventGroupId)
    throw "Evento não informado";

  const id = registration.eventId || registration.eventGroupId;

  const { batch, category, coupon } = await verifyRegistrationAvailability({
    registration: request,
    userId: userSession.id,
  });

  const code = (
    await generateParticipantCode(
      registration.eventId ? { eventId: id } : { eventGroupId: id }
    )
  )[0];

  if (!code) throw "Código de participante não encontrado";

  const categoryPrice: number = await readRegistrationPrice({
    batch,
    categoryId: registration.categoryId,
  });

  const orderId = categoryPrice ? await createOrder("@todo") : null;
  const status = categoryPrice ? "pending" : "active";

  const createRegistration = await prisma.eventRegistration.create({
    data: {
      ...registration,
      userId: userSession.id,
      id: registrationId,
      qrCode: await generateQrCode(registrationId),
      code,
      status,
      orderId,
      batchId: batch.id,
    },
  });

  if (!createRegistration) throw "Erro ao criar inscrição.";

  const event = request.eventId
    ? (await readEvents({ where: { id: request.eventId } }))[0]
    : null;

  const eventGroup = request.eventGroupId
    ? (await readEventGroups({ where: { id: request.eventGroupId } }))[0]
    : null;

  if (!event && !eventGroup) throw "Evento não encontrado.";

  const organization = (
    await readOrganizations({
      where: { id: event?.organizationId || eventGroup?.organizationId },
    })
  )[0];

  return { registration: createRegistration, event, eventGroup, organization };
}

export async function createMultipleRegistrations(
  request: CreateMultipleRegistrationsDto & { userSession: UserSession }
) {
  const event = request.eventId
    ? (await readEvents({ where: { id: request.eventId } }))[0]
    : null;

  const eventGroup = request.eventGroupId
    ? (await readEventGroups({ where: { id: request.eventGroupId } }))[0]
    : null;

  if (!event && !eventGroup) throw "Evento não encontrado.";

  const documents = request.teamMembers.map((member) => member.user.document);

  const existingUsers = await prisma.user.findMany({
    where: { document: { in: documents } },
    select: { id: true, document: true },
  });

  const existingDocuments = new Set(existingUsers.map((user) => user.document));

  const newDocuments = documents.filter(
    (document) => !existingDocuments.has(document)
  );

  if (newDocuments.length > 0) {
    for (const newDocument of newDocuments) {
      const userRecord = request.teamMembers.find(
        (member) => member.user.document === newDocument
      );
      if (!userRecord) throw "User not found";
      const address = await readAddressFromZipCode({
        zipCode: userRecord.user.zipCode,
      });
      if (!address.city || !address.state) throw "Address not found";
      await prisma.user.create({
        data: {
          fullName: userRecord.user.name,
          email: userRecord.user.email,
          document: userRecord.user.document,
          phone: userRecord.user.phone,
          role: "user",
          info: {
            create: {
              gender: userRecord.user.gender as Gender,
              birthDate: dayjs(
                userRecord.user.birthDate,
                "DD/MM/YYYY"
              ).toISOString(),
              zipCode: userRecord.user.zipCode,
              stateId: address.state.id || "",
              cityId: address.city.id || "",
              address: address.address,
              number: userRecord.user.number || "",
              complement: userRecord.user.complement,
            },
          },
        },
      });
    }
  }

  const allUserIds = await prisma.user.findMany({
    where: {
      document: {
        in: documents,
      },
    },
    select: { id: true, document: true },
  });

  let team: Team | undefined;
  if (request.createTeam && request.teamName) {
    team = await createTeam({
      name: request.teamName,
      members: allUserIds.find((user) => user.id === request.userSession.id)
        ? allUserIds.map((user) => user.id)
        : [...allUserIds.map((user) => user.id), request.userSession.id],
      ownerId: request.userSession.id,
    });
  }

  const userRegistrationsInfo = request.teamMembers.map((member) => {
    const userId = allUserIds.find(
      (user) => user.document === member.user.document
    )?.id;
    return { userId, ...member.registration, couponId: undefined };
  });

  for (const user of userRegistrationsInfo) {
    if (!user.userId) throw "Usuário não encontrado";

    const { batch, category, coupon } = await verifyRegistrationAvailability({
      registration: {
        categoryId: user.categoryId,
        couponId: user.couponId,
        eventId: request.eventId,
        eventGroupId: request.eventGroupId,
      },
      userId: user.userId,
      multiple: true,
    });
    const code = await generateParticipantCode(
      request.eventId
        ? { eventId: request.eventId }
        : { eventGroupId: request.eventGroupId }
    );
    if (!code) throw "Código de participante não encontrado";
    if (!user.userId) throw "Usuário não encontrado";

    const { addon, ...parsedUser } = user;
    const id = crypto.randomUUID();
    await prisma.eventRegistration.create({
      data: {
        ...parsedUser,
        qrCode: await generateQrCode(id),
        batchId: batch.id,
        addonId: addon?.id,
        addonOption: addon?.option,
        teamId: team ? team.id : undefined,
        userId: user.userId,
        eventId: request.eventId,
        eventGroupId: request.eventGroupId,
        code,
        status: "active",
      },
    });
  }

  const organization = (
    await readOrganizations({
      where: { id: event?.organizationId || eventGroup?.organizationId },
    })
  )[0];

  return { event, eventGroup, organization };
}

export async function updateRegistrationStatus(request: {
  registrationId: string;
  userSession: UserSession;
  status: string;
}) {
  const updatedRegistration = await prisma.eventRegistration.update({
    where: { id: request.registrationId, userId: request.userSession.id },
    data: { status: "cancelled" },
  });

  if (!updatedRegistration) throw "Erro ao cancelar inscrição.";
  return updatedRegistration;
}

async function verifyRegistrationAvailability({
  registration,
  userId,
  multiple,
}: {
  registration: {
    eventId?: string;
    eventGroupId?: string;
    categoryId: string;
    couponId?: string;
  };
  userId: string;
  multiple?: boolean;
}) {
  let coupon: BatchCoupon | null = null;

  const previousRegistration = await prisma.eventRegistration.findFirst({
    where: registration.eventId
      ? { eventId: registration.eventId, userId, status: { not: "cancelled" } }
      : {
          eventGroupId: registration.eventGroupId,
          userId,
          status: { not: "cancelled" },
        },
    include: { user: { select: { fullName: true, document: true } } },
  });

  if (previousRegistration)
    throw `O CPF ${formatCPF(previousRegistration.user.document)} já foi inscrito no evento.`;

  const batch = await readActiveBatch({
    where: registration.eventId
      ? { eventId: registration.eventId }
      : { eventGroupId: registration.eventGroupId },
  });
  if (!batch) throw "Lote de inscrição ativo não encontrado";

  if (batch.registrationType === "team" && multiple)
    throw "Lote não permitido para inscrições em equipe.";
  if (batch.registrationType === "individual" && !multiple)
    throw "Lote não permitido para inscrições individuais.";

  if (registration.couponId)
    coupon = await readCoupon({
      couponId: registration.couponId,
      batchId: batch?.id,
    });

  if (!batch) throw "Lote de inscrição não encontrado";
  const category = (
    await readModalityCategories({
      where: { id: registration.categoryId },
    })
  )[0];
  if (!category) throw "Categoria não encontrada";

  if (!coupon?.overruler) {
    await verifyBatchDisponibility({
      batch,
      categoryId: registration.categoryId,
    });

    await verifyCategoryDisponibility(
      registration.eventId
        ? {
            category: category,
            userId: userId,
            eventId: registration.eventId,
          }
        : {
            category: category,
            userId: userId,
            eventGroupId: registration.eventGroupId,
          }
    );
  }

  return { batch, coupon, category };
}

async function readRegistrationPrice({
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

async function generateParticipantCode({
  eventId,
  eventGroupId,
}: {
  eventId?: string;
  eventGroupId?: string;
}) {
  if (eventId && eventGroupId)
    throw "Evento e grupo de evento não podem ser informados ao mesmo tempo";
  if (!eventId && !eventGroupId)
    throw "Evento ou grupo de evento não informado";

  const eventRegistrations = await prisma.eventRegistration.findMany({
    where: eventId
      ? { eventId, status: { not: "cancelled" } }
      : { eventGroupId, status: { not: "cancelled" } },
    select: { code: true },
  });

  const participantCodes = eventRegistrations.sort(
    (a, b) => Number(a.code) - Number(b.code)
  );

  return (
    Number(participantCodes[participantCodes.length - 1]?.code ?? 0) + 1
  ).toString();
}

async function generateQrCode(id: string) {
  try {
    // Generate QR code with specified data
    const qrCodeData = await QRCode.toDataURL(id);
    const fileName = crypto.randomUUID();

    // Convert base64 string to a buffer
    const dataUrlToBlob = (dataUrl: string) => {
      const arr = dataUrl.split(",");
      const match = arr[0]?.match(/:(.*?);/);

      // Check if the match was successful
      if (!match || !match[1] || !arr[1]) {
        throw "Unable to extract MIME type from data URL";
      }

      const mime = match[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], { type: mime });
    };

    const blob = dataUrlToBlob(qrCodeData);
    const file = new File([blob], fileName, { type: "image/png" });
    return await uploadFile(file, `qr-codes/${fileName}.png`);
  } catch (error) {
    throw "Erro ao gerar QR Code. " + error;
  }
}
