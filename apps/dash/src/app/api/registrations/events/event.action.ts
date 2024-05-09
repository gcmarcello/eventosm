"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { ActionResponse, maskEmail } from "odinkit";
import {
  EventCreateMultipleRegistrationsDto,
  EventCreateRegistrationDto,
  SignupRegistrationDto,
} from "./event.dto";
import * as service from "./event.service";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";
import { SignupMiddleware } from "@/middleware/functions/signup.middleware";

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

export async function createEventSignupRegistration(
  request: SignupRegistrationDto
) {
  await UseMiddlewares(request).then(SignupMiddleware);
  let data;
  try {
    data = await service.createEventSignupRegistration(request);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect:
      `/eventos/${request.eventId}` +
      "?registrationCompleted=true" +
      `&email=${maskEmail(data.user.email)}`,
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
