import { getServerEnv } from "@/app/api/env";
import { CreatePayment } from "shared-types";
import { CreatePaymentDto } from "./dto";

export async function createPayment(data: CreatePaymentDto) {
  const { registrations, ...rest } = data;

  const parsedRegistrations = registrations ?? [];

  return await prisma.payment.create({
    data: {
      ...rest,
      EventRegistration: { connect: parsedRegistrations.map((id) => ({ id })) },
    },
  });
}

export async function cancelPayment(paymentId: string) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "cancelled" },
  });
}

export async function calculatePaymentValue(registrationIds: string[]) {
  let totalPrice = 0;
  const registrations = await prisma.eventRegistration.findMany({
    where: { id: { in: registrationIds } },
    include: {
      batch: {
        include: {
          CategoryBatch: true,
          ModalityBatch: true,
        },
      },
      addon: true,
    },
  });

  if (!registrations.length) throw "Inscrições não encontradas";

  for (const registration of registrations) {
    let registrationPrice = 0;

    if (registration.addonId)
      registrationPrice += registration.addon?.price ?? 0;

    if (registration.batch.categoryControl) {
      const categoryBatch = registration.batch.CategoryBatch.find(
        (c) => c.categoryId === registration.categoryId
      );
      if (categoryBatch) return (registrationPrice += categoryBatch.price ?? 0);
    }

    if (registration.batch.modalityControl) {
      const modalityBatch = registration.batch.ModalityBatch.find(
        (m) => m.modalityId === registration.modalityId
      );
      if (modalityBatch) return (registrationPrice += modalityBatch.price ?? 0);
    }

    registrationPrice += registration.batch.price;
    totalPrice += registrationPrice;
  }

  return totalPrice;
}

export async function createOrder(arg: CreatePayment) {
  return await fetch(getServerEnv("QUEUE_URL") + "/asaas/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
}
