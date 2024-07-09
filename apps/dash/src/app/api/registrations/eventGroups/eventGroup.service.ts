import { UserSession } from "@/middleware/functions/userSession.middleware";
import { chooseTextColor } from "@/utils/colors";
import dayjs from "dayjs";
import { Email } from "email-templates";
import { readProtectedBatch, readActiveBatch } from "../../batches/service";
import { sendEmail } from "../../emails/service";
import { getServerEnv } from "../../env";
import { readEvents, readEventGroups } from "../../events/service";
import { createOrder } from "../../payments/service";
import { generateQrCodes } from "../../qrcode/service";
import {
  EventGroupCreateMultipleRegistrationsDto,
  EventGroupCreateRegistrationDto,
} from "../eventGroups/eventGroup.dto";
import {
  BatchCoupon,
  EventRegistrationStatus,
  RegistrationDocument,
} from "@prisma/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { RegistrationDto } from "../dto";
import { readRegistrationPrice } from "../service";
import { formatCPF } from "odinkit";
import { upsertRegistrationDocument } from "../documents/service";

export async function createEventGroupRegistration(
  request: EventGroupCreateRegistrationDto & { userSession: UserSession }
) {
  const {
    userSession,
    acceptedTerms,
    registration: { addon, documents, ...registrationInfo },
  } = request;

  const registrationId = crypto.randomUUID();

  if (!registrationInfo) throw "Evento não informado";
  if (!registrationInfo.modalityId) throw "Modalidade não informada";
  if (!registrationInfo.categoryId) throw "Categoria não informada";

  const id = request.eventGroupId;

  const batch = request.batchId
    ? await readProtectedBatch({ where: { id: request.batchId } })
    : await readActiveBatch({
        where: { eventGroupId: request.eventGroupId },
      });

  if (!batch) throw "Lote de inscrição ativo não encontrado.";

  await verifyEventGroupRegistrationAvailability({
    registrations: [registrationInfo],
    eventGroupId: id,
    userIds: [userSession.id],
    batch,
  });

  await verifyEventGroupAvailableSlots({
    registrations: [registrationInfo],
    batchId: request.batchId && batch.id,
    eventGroupId: request.eventGroupId!,
  });

  await verifyRegistrationDocuments(
    registrationInfo.categoryId,
    registrationId,
    documents
  );

  const eventRegistrations = await prisma.eventRegistration.count({
    where: { eventGroupId: request.eventGroupId },
  });

  const code = (eventRegistrations + 1).toString();

  if (!code) throw "Código de participante não encontrado";

  const categoryPrice: number = await readRegistrationPrice({
    batch,
    categoryId: registrationInfo.categoryId,
  });

  const orderId = /* categoryPrice ? await createOrder("@todo") :  */ null;
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
      eventGroupId: id,
      id: registrationId,
      qrCode: `https://${bucketName}.s3.${region}.backblazeb2.com/qr-codes/${registrationId}.png`,
      code,
      status,
      batchId: batch.id,
      addonId: addon?.id,
      addonOption: addon?.option,
    },
  });

  if (documents?.length) {
    await upsertRegistrationDocument(
      documents?.map((doc) => ({ ...doc, registrationId }))
    );
  }

  if (!createRegistration) throw "Erro ao criar inscrição.";

  const eventGroup = request.eventGroupId
    ? (await readEventGroups({ where: { id: request.eventGroupId } }))[0]
    : null;

  if (!eventGroup) throw "Evento não encontrado.";

  const organization = await prisma.organization.findUnique({
    where: { id: eventGroup?.organizationId },
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
        category: eventGroup?.EventModality.flatMap(
          (m) => m.modalityCategory
        ).find((category) => category.id === registrationInfo.categoryId)
          ?.name!,
        modality: eventGroup?.EventModality.find(
          (m) => m.id === registrationInfo.modalityId
        )?.name!,
        dateEnd: dayjs(
          eventGroup?.Event[eventGroup?.Event.length - 1]!.dateEnd
        ).format("DD/MM/YYYY"),
        dateStart: dayjs(eventGroup!.Event[0]!.dateStart).format("DD/MM/YYYY"),
        eventName: eventGroup.name,
        location: eventGroup?.location || "",
        name: userSession.fullName || "Amigo",
        orgName: organization!.name,
        qrCode: `https://${bucketName}.s3.${region}.backblazeb2.com/qr-codes/${registrationId}.png`,
        siteLink: `${organization?.OrgCustomDomain[0]?.domain!}`,
        eventLink: `/campeonatos/${eventGroup?.slug}`,
      },
    },
  ];

  await sendEmail(emailArray);

  return { registration: createRegistration, eventGroup, organization };
}

export async function createEventGroupMultipleRegistrations(
  request: EventGroupCreateMultipleRegistrationsDto & {
    userSession: UserSession;
  }
) {
  const eventGroup = request.eventGroupId
    ? (await readEventGroups({ where: { id: request.eventGroupId } }))[0]
    : null;
  const selectedUsers = request.teamMembers.filter((m) => m.selected);

  if (!selectedUsers.length) throw "Nenhum atleta selecionado.";

  if (!eventGroup) throw "Evento não encontrado.";

  const batch = request.batchId
    ? await readProtectedBatch({ where: { id: request.batchId } })
    : await readActiveBatch({
        where: { eventGroupId: eventGroup?.id },
      });

  if (!batch) throw "Lote de inscrição ativo não encontrado.";

  if (
    batch.multipleRegistrationLimit &&
    selectedUsers.length > batch?.multipleRegistrationLimit
  )
    throw "Limite de inscrições por equipe excedido";

  await verifyEventGroupAvailableSlots({
    registrations: request.teamMembers.filter((tm) => tm.selected),
    batchId: request.batchId && batch.id,
    eventGroupId: request.eventGroupId!,
  });

  await verifyEventGroupRegistrationAvailability({
    registrations: request.teamMembers,
    eventGroupId: request.eventGroupId,
    batch,
    userIds: selectedUsers.filter((m) => m.selected).map((u) => u.userId || ""),
  });

  const users = await prisma.user.findMany({
    where: { id: { in: selectedUsers.map((u) => u.userId || "") } },
  });

  const eventRegistrations = await prisma.eventRegistration.count({
    where: { eventGroupId: request.eventGroupId },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: eventGroup.organizationId },
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
      eventGroupId: request.eventGroupId,
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
          eventGroup?.EventModality.flatMap((m) => m.modalityCategory).find(
            (category) => category.id === parsedUser.categoryId
          )?.name || "",
        modality:
          eventGroup?.EventModality.find((m) => m.id === parsedUser.modalityId)
            ?.name || "",
        dateEnd: dayjs(
          eventGroup?.Event[eventGroup.Event.length - 1]?.dateEnd
        ).format("DD/MM/YYYY"),
        dateStart: dayjs(eventGroup!.Event[0]!.dateStart).format("DD/MM/YYYY"),
        eventName: eventGroup.name,
        location: eventGroup?.location || "",
        name: users.find((u) => u.id === user.userId)?.fullName || "Amigo",
        orgName: organization!.name,
        qrCode: `https://${bucketName}.s3.${region}.backblazeb2.com/qr-codes/${id}.png`,
        siteLink: `${organization?.OrgCustomDomain[0]?.domain!}`,
        eventLink: `/campeonatos/${eventGroup?.id}`,
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

  return { eventGroup };
}

export async function reestablishEventGroupRegistration(
  registrationId: string
) {
  const oldRegistration = await prisma.eventRegistration.findUnique({
    where: { id: registrationId },
    include: {
      user: true,
      category: true,
      modality: true,
      eventGroup: {
        include: {
          Organization: { include: { OrgCustomDomain: true } },
          Event: true,
        },
      },
    },
  });

  if (!oldRegistration) throw "Inscrição não encontrada.";

  const oldUnjustifiedAbsences = oldRegistration?.unjustifiedAbsences;

  await prisma.$transaction([
    prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { status: "active", unjustifiedAbsences: 0, justifiedAbsences: 0 },
    }),
    prisma.eventAbsences.updateMany({
      where: { registrationId },
      data: { status: "approved" },
    }),
  ]);

  const emailArray: Email<"registration_email">[] = [
    {
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: "Inscrição confirmada",
        to: oldRegistration.user.email,
      },
      template: "registration_email",
      templateParameters: {
        mainColor:
          oldRegistration.eventGroup?.Organization?.options.colors.primaryColor
            .hex || "#4F46E5",
        headerTextColor: chooseTextColor(
          oldRegistration.eventGroup?.Organization?.options.colors.primaryColor
            .hex || "#4F46E5"
        ),
        category: oldRegistration.category?.name || "",
        modality: oldRegistration.modality?.name || "",
        dateEnd: dayjs(
          oldRegistration.eventGroup?.Event[
            oldRegistration.eventGroup?.Event.length - 1
          ]!.dateEnd
        ).format("DD/MM/YYYY"),
        dateStart: dayjs(
          oldRegistration.eventGroup!.Event[0]!.dateStart
        ).format("DD/MM/YYYY"),
        eventName: oldRegistration.eventGroup?.name || "",
        location: oldRegistration.eventGroup?.location || "",
        name: oldRegistration.user.fullName || "Amigo",
        orgName: oldRegistration.eventGroup?.Organization.name!,
        qrCode: `https://${getServerEnv("AWS_BUCKET_NAME")}.s3.${getServerEnv("AWS_REGION")}.backblazeb2.com/qr-codes/${oldRegistration.id}.png`,
        siteLink: `${oldRegistration?.eventGroup?.Organization?.OrgCustomDomain[0]?.domain!}`,
        eventLink: `/campeonatos/${oldRegistration?.eventGroup?.slug}`,
      },
    },
  ];

  return await sendEmail(emailArray);
}

export async function resendEventGroupRegistrationConfirmation(id: string) {
  const findRegistration = await prisma.eventRegistration.findUnique({
    where: { id },
    include: {
      eventGroup: {
        include: {
          EventRegistration: true,
          Organization: { include: { OrgCustomDomain: true } },
          Event: true,
        },
      },
      user: true,
      modality: true,
      category: true,
    },
  });

  if (!findRegistration) throw "Inscrição não encontrada.";

  const emailArray: Email<"registration_email">[] = [
    {
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: "Inscrição confirmada",
        to: findRegistration.user.email,
      },
      template: "registration_email",
      templateParameters: {
        mainColor:
          findRegistration.eventGroup?.Organization?.options.colors.primaryColor
            .hex || "#4F46E5",
        headerTextColor: chooseTextColor(
          findRegistration.eventGroup?.Organization?.options.colors.primaryColor
            .hex || "#4F46E5"
        ),
        category: findRegistration.category?.name || "",
        modality: findRegistration.modality?.name || "",
        dateEnd: dayjs(
          findRegistration.eventGroup?.Event[
            findRegistration.eventGroup?.Event.length - 1
          ]!.dateEnd
        ).format("DD/MM/YYYY"),
        dateStart: dayjs(
          findRegistration.eventGroup!.Event[0]!.dateStart
        ).format("DD/MM/YYYY"),
        eventName: findRegistration.eventGroup?.name || "",
        location: findRegistration.eventGroup?.location || "",
        name: findRegistration.user.fullName || "Amigo",
        orgName: findRegistration.eventGroup?.Organization.name!,
        qrCode: `https://${getServerEnv("AWS_BUCKET_NAME")}.s3.${getServerEnv("AWS_REGION")}.backblazeb2.com/qr-codes/${findRegistration.id}.png`,
        siteLink: `${findRegistration?.eventGroup?.Organization?.OrgCustomDomain[0]?.domain!}`,
        eventLink: `/campeonatos/${findRegistration?.eventGroup?.slug}`,
      },
    },
  ];

  return await sendEmail(emailArray);
}

async function verifyEventGroupRegistrationAvailability({
  registrations,
  eventGroupId,
  batch,
  userIds,
}: {
  registrations: RegistrationDto[];
  eventGroupId: string;
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations;
  userIds: string[];
}) {
  let coupon: BatchCoupon | null = null;

  if (!batch) throw "Lote de inscrição ativo não encontrado.";
  if (batch.registrationType === "team" && registrations.length <= 1)
    throw "Lote não permitido para inscrições individuais.";
  if (batch.registrationType === "individual" && registrations.length > 1)
    throw "Lote não permitido para inscrições em equipe.";

  const previousRegistration = await prisma.eventRegistration.findFirst({
    where: {
      eventGroupId,
      userId: { in: userIds },
      status: { not: "cancelled" },
    },
    include: { user: { select: { fullName: true, document: true } } },
  });

  if (previousRegistration)
    throw `O CPF ${formatCPF(previousRegistration.user.document)} já foi inscrito no evento.`;
}

async function verifyEventGroupAvailableSlots({
  registrations,
  batchId,
  eventGroupId,
}: {
  registrations: RegistrationDto[];
  eventGroupId: string;
  batchId?: string;
}) {
  let batch: EventRegistrationBatchesWithCategoriesAndRegistrations | null =
    null;

  if (batchId) {
    batch = await readProtectedBatch({ where: { id: batchId, eventGroupId } });
  } else {
    batch = await readActiveBatch({ where: { eventGroupId } });
  }

  if (!batch) throw "Lote de inscrição não encontrado";
  const registrationsCount = await prisma.eventRegistration.count({
    where: {
      eventGroupId,
      batchId: batch.id,
      status: { not: { in: ["cancelled", "suspended"] } },
    },
  });

  if (registrationsCount + registrations.length > batch.maxRegistrations)
    throw "Inscrições esgotadas.";

  if (batch.modalityControl) {
    const modalityBatchArray = batch.ModalityBatch;
    const registrationModalities = Array.from(
      new Set(registrations.map((r) => r.modalityId as string))
    );

    const modalitiesRegistrations = await prisma.eventRegistration.findMany({
      where: {
        modalityId: { in: registrationModalities },
        status: { not: { in: ["cancelled", "suspended"] } },
        batchId: batch.id,
      },
      select: { modalityId: true },
    });

    for (const modality of registrationModalities) {
      const modalityInfo = modalityBatchArray.find(
        (m) => m.modalityId === modality
      );
      const modalityRegistrations = modalitiesRegistrations.filter(
        (r) => r.modalityId === modalityInfo?.modalityId
      );

      const potentialRegistrations = registrations.filter(
        (r) => r.modalityId === modalityInfo?.modalityId
      ).length;

      if (!potentialRegistrations) continue;

      const maxRegistrations = modalityInfo?.maxRegistrations;

      if (!maxRegistrations && potentialRegistrations)
        throw `Limite de inscrições atingido.`;

      if (
        !maxRegistrations ||
        potentialRegistrations + modalityRegistrations.length > maxRegistrations
      ) {
        const modalityName = await prisma.eventModality.findUnique({
          where: { id: modalityInfo?.modalityId },
        });
        throw `Limite de inscrições na modalidade ${modalityName?.name} excedido.`;
      }
    }
  }

  if (batch.categoryControl) {
    const categoryBatchArray = batch.CategoryBatch;
    const categoryArray = categoryBatchArray.map((cb) => cb.category);
    const registrationsCategories = registrations.map(
      (r) => r.categoryId as string
    );

    const categoriesWithExistingRegistrations =
      await prisma.modalityCategory.findMany({
        where: { id: { in: registrationsCategories } },
        include: {
          _count: {
            select: {
              EventRegistration: {
                where: {
                  batchId: batch.id,
                  status: { not: { in: ["cancelled", "suspended"] } },
                },
              },
            },
          },
        },
      });

    for (const category of categoriesWithExistingRegistrations) {
      const categoryName = categoryArray.find(
        (c) => c.id === category.id
      )?.name;

      const count =
        registrations.filter((r) => r.categoryId === category.id).length +
        category._count.EventRegistration;

      const maxRegistrations = categoryBatchArray.find(
        (c) => c.categoryId === category.id
      )?.maxRegistrations;

      if (maxRegistrations || maxRegistrations === 0) {
        if (count > maxRegistrations)
          throw `Limite de inscrições na categoria ${categoryName} excedido.`;
      }
    }
  }
}

async function verifyRegistrationDocuments(
  id: string,
  registrationId: string,
  documents?: Omit<
    RegistrationDocument,
    | "id"
    | "name"
    | "createdAt"
    | "updatedAt"
    | "userDocumentId"
    | "registrationId"
    | "file"
  >[]
) {
  const category = await prisma.modalityCategory.findUnique({
    where: { id },
    select: { CategoryDocument: true },
  });

  if (!category) throw "Categoria não encontrada.";

  if (!category.CategoryDocument.length && documents?.length)
    throw "Documentos não permitidos para esta categoria.";

  if (!category.CategoryDocument.length) return;

  if (!documents) throw "Documentos não informados.";

  for (const document of category?.CategoryDocument) {
    if (!documents.find((d) => d.documentId === document.id))
      throw `Documento ${document.name || document.type} não encontrado.`;
  }

  return documents;
}
