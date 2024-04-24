"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ReadRegistrationBatchDto, UpsertRegistrationBatchDto } from "./dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import * as service from "./service";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "odinkit";

export async function upsertRegistrationBatch(
  request: UpsertRegistrationBatchDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    const upsertedBatch = await service.upsertRegistrationBatch(parsedRequest);
    revalidatePath(`/painel/eventos/${request.eventId}`);
    return ActionResponse.success({
      data: upsertedBatch,
      message: "Lote de inscrição salvo com sucesso",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function readModalityBatchRegistrations(request: {
  batchId: string;
}) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    const registrations =
      await service.readModalityBatchRegistrations(parsedRequest);
    return ActionResponse.success({
      data: registrations,
      message: "Informações encontradas com sucesso.",
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
}
