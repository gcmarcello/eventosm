"use server";
import { ActionResponse } from "odinkit";
import { CreateResultsDto } from "./dto";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import * as service from "./service";

export async function createEventResults(request: CreateResultsDto) {
  try {
    await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    await service.createEventResults(request);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: `/painel/eventos/grupos/${request.eventGroupId}/etapas/`,
  });
}

export async function readUserEventGroupResults(request: {
  eventGroupId: string;
}) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );

    return ActionResponse.success({
      data: await service.readUserEventGroupResults(parsedRequest),
      message: "Resultados carregados com sucesso.",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
