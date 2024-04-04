"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { ActionResponse } from "odinkit";
import {
  EventGroupCreateRegistrationDto,
  EventGroupCreateMultipleRegistrationsDto,
} from "./eventGroup.dto";
import * as service from "./eventGroup.service";

export async function createEventGroupIndividualRegistration(
  request: EventGroupCreateRegistrationDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    await service.createEventGroupRegistration(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: "/perfil",
  });
}

export async function createEventGroupMultipleRegistrations(
  request: EventGroupCreateMultipleRegistrationsDto
) {
  let newRegistrations;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );

    newRegistrations =
      await service.createEventGroupMultipleRegistrations(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: "/perfil",
  });
}
