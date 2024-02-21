"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UpsertCouponBatchDto } from "../registrations/dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import * as service from "./service";

export async function upsertCouponBatchDto(request: UpsertCouponBatchDto) {
  const { request: parsedRequest } = await UseMiddlewares(request)
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  const upsertedBatch = await service.upsertCouponBatchDto(parsedRequest);

  return upsertedBatch;
}
