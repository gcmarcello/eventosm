import { UserSession } from "@/middleware/functions/userSession.middleware";
import {
  EventCreateMultipleRegistrationsDto,
  EventCreateRegistrationDto,
} from "./event.dto";
import { readActiveBatch, readProtectedBatch } from "../../batches/service";
import { readRegistrationPrice } from "../service";
import { createOrder } from "../../payments/service";
import { getServerEnv } from "../../env";
import { generateQrCodes } from "../../qrcode/service";
import { Email } from "email-templates";
import dayjs from "dayjs";
import { chooseTextColor } from "@/utils/colors";
import { sendEmail } from "../../emails/service";
import { RegistrationDto } from "../dto";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { BatchCoupon, EventRegistrationStatus } from "@prisma/client";
import { formatCPF } from "odinkit";

export async function createEventIndividualRegistration(
  request: EventCreateRegistrationDto & { userSession: UserSession }
) {
  const {
    userSession,
    acceptedTerms,
    registration: { addon, ...registrationInfo },
  } = request;

  const registrationId = crypto.randomUUID();

  if (!registrationInfo) throw "Evento não informado";
  if (!registrationInfo.modalityId) throw "Modalidade não informada";
  if (!registrationInfo.categoryId) throw "Categoria não informada";

  const id = request.eventId;

  const batch = request.batchId
    ? await readProtectedBatch({ where: { id: request.batchId } })
    : await readActiveBatch({
        where: { eventId: request.eventId },
      });

  if (!batch) throw "Lote de inscrição ativo não encontrado";

  await verifyEventRegistrationAvailability({
    registrations: [registrationInfo],
    eventId: id,
    userIds: [userSession.id],
    batch,
  });

  await verifyEventAvailableSlots({
    registrations: [registrationInfo],
    batchId: request.batchId && batch.id,
    eventId: request.eventId,
  });

  const eventRegistrations = await prisma.eventRegistration.count({
    where: { eventId: request.eventId },
  });

  const code = (eventRegistrations + 1).toString();

  if (!code) throw "Código de participante não encontrado";

  const categoryPrice: number = await readRegistrationPrice({
    batch,
    categoryId: registrationInfo.categoryId,
  });

  const orderId = categoryPrice ? await createOrder("@todo") : null;
  const status = categoryPrice ? "pending" : "active";
  const bucketName = getServerEnv("AWS_BUCKET_NAME") || "";
  const region = getServerEnv("AWS_REGION") || "";
  const createRegistration = await prisma.eventRegistration.create({
    data: {
      ...registrationInfo,
      teamId: request?.teamId || null,
      modalityId: registrationInfo.modalityId,
      categoryId: registrationInfo.categoryId,
      userId: userSession.id,
      eventId: id,
      id: registrationId,
      qrCode: `https://${bucketName}.s3.${region}.backblazeb2.com/qr-codes/${registrationId}.png`,
      code,
      status,
      orderId,
      batchId: batch.id,
      addonId: addon?.id,
      addonOption: addon?.option,
    },
  });

  if (!createRegistration) throw "Erro ao criar inscrição.";

  const event = request.eventId
    ? await prisma.event.findUnique({
        where: { id: request.eventId },
        include: { EventModality: { include: { modalityCategory: true } } },
      })
    : null;

  if (!event) throw "Evento não encontrado.";

  const organization = await prisma.organization.findUnique({
    where: { id: event?.organizationId },
    include: { OrgCustomDomain: true },
  });

  await generateQrCodes([registrationId]);

  const emailArray: Email<"registration_email">[] = [
    {
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: "Inscrição confirmada",
        to: userSession.email,
      },
      template: "registration_email",
      templateParameters: {
        mainColor: organization?.options.colors.primaryColor.hex || "#4F46E5",
        headerTextColor: chooseTextColor(
          organization?.options.colors.primaryColor.hex || "#4F46E5"
        ),
        category: event?.EventModality.flatMap((m) => m.modalityCategory).find(
          (category) => category.id === registrationInfo.categoryId
        )?.name!,
        modality: event?.EventModality.find(
          (m) => m.id === registrationInfo.modalityId
        )?.name!,
        dateEnd: dayjs(event.dateEnd).format("DD/MM/YYYY"),
        dateStart: dayjs(event.dateStart).format("DD/MM/YYYY"),
        eventName: event.name,
        location: event.location,
        name: userSession.fullName || "Amigo",
        orgName: organization!.name,
        qrCode: `https://${bucketName}.s3.${region}.backblazeb2.com/qr-codes/${registrationId}.png`,
        siteLink: `${organization?.OrgCustomDomain[0]?.domain!}`,
        eventLink: `/${event?.slug}`,
      },
    },
  ];

  await sendEmail(emailArray);

  return { registration: createRegistration, event, organization };
}

export async function createEventMultipleRegistrations(
  request: EventCreateMultipleRegistrationsDto & {
    userSession: UserSession;
  }
) {
  const event = request.eventId
    ? await prisma.event.findUnique({
        where: { id: request.eventId },
        include: { EventModality: { include: { modalityCategory: true } } },
      })
    : null;
  const selectedUsers = request.teamMembers.filter((m) => m.selected);

  if (!selectedUsers.length) throw "Nenhum atleta selecionado.";

  if (!event) throw "Evento não encontrado.";

  const batch = request.batchId
    ? await readProtectedBatch({ where: { id: request.batchId } })
    : await readActiveBatch({
        where: { eventId: event?.id },
      });

  if (!batch) throw "Lote de inscrição ativo não encontrado";

  if (
    batch.multipleRegistrationLimit &&
    selectedUsers.length > batch?.multipleRegistrationLimit
  )
    throw "Limite de inscrições por equipe excedido";

  await verifyEventAvailableSlots({
    registrations: request.teamMembers.filter((tm) => tm.selected),
    batchId: request.batchId && batch.id,
    eventId: request.eventId,
  });

  await verifyEventRegistrationAvailability({
    registrations: request.teamMembers,
    eventId: request.eventId,
    batch,
    userIds: selectedUsers.filter((m) => m.selected).map((u) => u.userId || ""),
  });

  const users = await prisma.user.findMany({
    where: { id: { in: selectedUsers.map((u) => u.userId || "") } },
  });

  const eventRegistrations = await prisma.eventRegistration.count({
    where: { eventId: request.eventId },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: event.organizationId },
    include: { OrgCustomDomain: true },
  });

  const participantsArray = [];
  let emailArray: Email<"registration_email">[] = [];
  const bucketName = getServerEnv("AWS_BUCKET_NAME") || "";
  const region = getServerEnv("AWS_REGION") || "";
  for (const [index, user] of request.teamMembers
    .filter((member) => member.selected)
    .entries()) {
    if (!user.userId) throw "Usuário não encontrado";
    if (!user.selected) continue;
    if (!user.modalityId) throw "Modalidade não informada";
    if (!user.categoryId) throw "Categoria não informada";
    const { addon, ...parsedUser } = user;

    const id = crypto.randomUUID();
    participantsArray.push({
      userId: user.userId,
      modalityId: user.modalityId,
      categoryId: user.categoryId,
      id,
      qrCode: `https://${bucketName}.s3.${region}.backblazeb2.com/qr-codes/${id}.png`,
      batchId: batch.id,
      addonId: addon?.id,
      addonOption: addon?.option,
      teamId: request?.teamId || null,
      eventId: request.eventId,
      code: (eventRegistrations + (index + 1)).toString(),
      status: "active" as EventRegistrationStatus,
    });

    emailArray.push({
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: "Inscrição confirmada",
        to: users.find((u) => u.id === user.userId)?.email!,
      },
      template: "registration_email",
      templateParameters: {
        mainColor: organization?.options.colors.primaryColor.hex || "#4F46E5",
        headerTextColor: chooseTextColor(
          organization?.options.colors.primaryColor.hex || "#4F46E5"
        ),
        category:
          event?.EventModality.flatMap((m) => m.modalityCategory).find(
            (category) => category.id === parsedUser.categoryId
          )?.name || "",
        modality:
          event?.EventModality.find((m) => m.id === parsedUser.modalityId)
            ?.name || "",
        dateEnd: dayjs(event?.dateEnd).format("DD/MM/YYYY"),
        dateStart: dayjs(event.dateStart).format("DD/MM/YYYY"),
        eventName: event.name,
        location: event?.location || "",
        name: users.find((u) => u.id === user.userId)?.fullName || "Amigo",
        orgName: organization!.name,
        qrCode: `https://${bucketName}.s3.${region}.backblazeb2.com/qr-codes/${id}.png`,
        siteLink: `${organization?.OrgCustomDomain[0]?.domain!}`,
        eventLink: `/${event?.id}`,
      },
    });
  }

  const registrations = await prisma.eventRegistration.createMany({
    data: participantsArray,
  });

  if (!registrations) throw "Erro ao criar inscrições.";

  const registrationsIds = participantsArray.map((reg) => reg.id);

  if (emailArray.length) await sendEmail(emailArray);

  await generateQrCodes(registrationsIds);

  return { event };
}

async function verifyEventRegistrationAvailability({
  registrations,
  eventId,
  batch,
  userIds,
}: {
  registrations: RegistrationDto[];
  eventId: string;
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations;
  userIds: string[];
}) {
  let coupon: BatchCoupon | null = null;

  if (!batch) throw "Lote de inscrição ativo não encontrado";
  if (batch.registrationType === "team" && registrations.length <= 1)
    throw "Lote não permitido para inscrições individuais.";
  if (batch.registrationType === "individual" && registrations.length > 1)
    throw "Lote não permitido para inscrições em equipe.";

  const previousRegistration = await prisma.eventRegistration.findFirst({
    where: {
      eventId,
      userId: { in: userIds },
      status: { not: "cancelled" },
    },
    include: { user: { select: { fullName: true, document: true } } },
  });

  if (previousRegistration)
    throw `O CPF ${formatCPF(previousRegistration.user.document)} já foi inscrito no evento.`;
}

async function verifyEventAvailableSlots({
  registrations,
  batchId,
  eventId,
}: {
  registrations: RegistrationDto[];
  eventId: string;
  batchId?: string;
}) {
  let batch: EventRegistrationBatchesWithCategoriesAndRegistrations | null =
    null;

  if (batchId) {
    batch = await readProtectedBatch({ where: { id: batchId, eventId } });
  } else {
    batch = await readActiveBatch({ where: { eventId } });
  }

  if (!batch) throw "Lote de inscrição não encontrado";
  const registrationsCount = await prisma.eventRegistration.count({
    where: {
      eventId,
      batchId: batch.id,
      status: { not: { in: ["cancelled", "suspended"] } },
    },
  });

  if (registrationsCount + registrations.length > batch.maxRegistrations)
    throw "Inscrições esgotadas.";

  if (batch.modalityControl) {
    const modalityBatchArray = batch.ModalityBatch;
    const modalityArray = modalityBatchArray.map((mb) => mb.modalityId);

    const modalitiesRegistrations = await prisma.eventRegistration.findMany({
      where: {
        modalityId: { in: modalityArray },
        status: { not: { in: ["cancelled", "suspended"] } },
        batchId: batch.id,
      },
      include: { _count: true },
    });

    for (const modality of modalityBatchArray) {
      const modalityRegistrations = modalitiesRegistrations.filter(
        (r) => r.modalityId === modality.modalityId
      );
      const count = registrations.filter(
        (r) => r.modalityId === modality.modalityId
      ).length;
      const maxRegistrations = modality.maxRegistrations;

      if (!maxRegistrations) throw `Limite de inscrições atingido.`;

      const modalityName = await prisma.eventModality.findUnique({
        where: { id: modality.modalityId },
      });

      console.log(modalityRegistrations.length);

      if (count + modalityRegistrations.length > maxRegistrations)
        throw `Limite de inscrições na modalidade ${modalityName?.name || modality.id} excedido.`;
    }
  }

  if (batch.categoryControl) {
    const categoryBatchArray = batch.CategoryBatch;
    const categoryArray = categoryBatchArray.map((cb) => cb.category);

    for (const category of categoryBatchArray) {
      const categoryName = categoryArray.find(
        (c) => c.id === category.categoryId
      )?.name;
      const categoryExistingRegistrations =
        await prisma.eventRegistration.count({
          where: {
            eventId,
            categoryId: category.categoryId,
            status: { not: { in: ["cancelled", "suspended"] } },
          },
        });
      const count =
        registrations.filter((r) => r.categoryId === category.categoryId)
          .length + categoryExistingRegistrations;
      const maxRegistrations = categoryBatchArray.find(
        (c) => c.categoryId === category.categoryId
      )?.maxRegistrations;

      if (maxRegistrations) {
        if (count > maxRegistrations)
          throw `Limite de inscrições na categoria ${categoryName} excedido. ${Math.max(0, maxRegistrations - categoryExistingRegistrations)} restantes.`;
      }
    }
  }
}
