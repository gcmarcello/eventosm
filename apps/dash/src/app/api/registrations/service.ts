import { UserSession } from "@/middleware/functions/userSession.middleware";
import { ReadRegistrationsDto, RegistrationDto } from "./dto";

import { BatchCoupon, Gender, Team } from "@prisma/client";

import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import { createOrder } from "../payments/service";

import { readActiveBatch, readProtectedBatch } from "../batches/service";

import { readEventGroups, readEvents } from "../events/service";

import dayjs from "dayjs";
import { formatCPF } from "odinkit";

import { sendEmail } from "../emails/service";
import { chooseTextColor } from "@/utils/colors";
import { getServerEnv } from "@/app/api/env";
import { Email } from "email-templates";
import { generateQrCodes } from "../qrcode/service";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { EventGroupCreateMultipleRegistrationsDto } from "./eventGroups/eventGroup.dto";

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

export async function readRegistrationPrice({
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
