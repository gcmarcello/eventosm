"use server";
import { ActionResponse } from "odinkit";
import { UpdateEventStatusDto } from "./dto";
import * as eventStatus from "./service/eventStatus.service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { revalidatePath } from "next/cache";

export async function updateEventStatus(request: UpdateEventStatusDto) {
  const { request: parsedRequest } = await UseMiddlewares(request)
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);
  try {
    const data = await eventStatus.updateEventStatus(parsedRequest);
    revalidatePath(
      `/painel/eventos/grupos/${parsedRequest.eventGroupId}}/etapas`
    );
    return ActionResponse.success({ data });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
