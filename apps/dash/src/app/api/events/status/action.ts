"use server";
import { ActionResponse } from "odinkit";
import { UpdateEventGroupStatusDto, UpdateEventStatusDto } from "./dto";
import * as eventStatus from "./service/eventStatus.service";
import * as eventGroupStatus from "./service/eventGroupStatus.service";
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

export async function updateEventGroupStatus(
  request: UpdateEventGroupStatusDto
) {
  const { request: parsedRequest } = await UseMiddlewares(request)
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);
  try {
    const data = await eventGroupStatus.updateEventGroupStatus(parsedRequest);
    revalidatePath(`/painel/eventos/grupos/${parsedRequest.eventGroupId}`);
    return ActionResponse.success({ data });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
