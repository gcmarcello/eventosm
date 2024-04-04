"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { ActionResponse } from "odinkit";
import {
  EventCreateMultipleRegistrationsDto,
  EventCreateRegistrationDto,
} from "./event.dto";
import * as service from "./event.service";

export async function createEventIndividualRegistration(
  request: EventCreateRegistrationDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    await service.createEventIndividualRegistration(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect:
      "/perfil?alert=success&message=" +
      encodeURIComponent("Inscrição realizada com sucesso!"),
  });
}

export async function createEventMultipleRegistrations(
  request: EventCreateMultipleRegistrationsDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    await service.createEventMultipleRegistrations(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect:
      "/perfil?alert=success&message=" +
      encodeURIComponent("Inscrições realizadas com sucesso!"),
  });
}
