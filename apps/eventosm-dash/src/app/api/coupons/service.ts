import { UserSession } from "@/middleware/functions/userSession.middleware";
import { UpsertCouponBatchDto } from "../registrations/dto";

export async function readCoupon({
  couponId,
  batchId,
}: {
  couponId: string;
  batchId: string;
}) {
  const coupon = await prisma.batchCoupon.findUnique({
    where: { id: couponId, eventRegistrationBatchId: batchId },
  });

  if (!coupon) throw "Cupom não encontrado para esse lote de inscrição";

  const couponUses = await prisma.eventRegistration.count({
    where: { couponId: coupon.id },
  });

  return coupon;
}

export async function upsertCouponBatchDto(
  request: UpsertCouponBatchDto & {
    userSession: UserSession;
    organizationId: string;
  }
) {
  const { organizationId, userSession, ...rest } = request;

  const upsertedBatch = await prisma.batchCoupon.upsert({
    where: { id: rest.id },
    update: { ...rest },
    create: { ...rest },
  });

  return upsertedBatch;
}
