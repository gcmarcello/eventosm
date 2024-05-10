import { getServerEnv } from "@/app/api/env";
import { CreatePayment } from "shared-types";
import { CreatePaymentDto } from "./dto";

export async function createPayment(data: CreatePaymentDto) {
  const registrations = data.registrations ?? [];
  return await prisma.payment.create({
    data: {
      status: "pending",
      EventRegistration: { connect: registrations.map((id) => ({ id })) },
    },
  });
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
