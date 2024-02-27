"use server";

import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import {
  CreateMultipleRegistrationsDto,
  ReadRegistrationsDto,
  UpsertRegistrationDto,
} from "./dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { ActionResponse } from "odinkit";
import * as service from "./service";
import { revalidatePath } from "next/cache";

export async function createIndividualRegistration(
  request: UpsertRegistrationDto
) {
  let newRegistration;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    newRegistration = await service.createRegistration(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  const redirectPath = newRegistration.event
    ? `/eventos/${newRegistration.event?.id}`
    : newRegistration.eventGroup?.eventGroupType === "free"
      ? `/eventos/serie/${newRegistration.eventGroup?.id}`
      : `/eventos/campeonatos/${newRegistration.eventGroup?.id}`;

  return ActionResponse.success({
    redirect: redirectPath,
  });
}

export async function createMultipleRegistrations(
  request: CreateMultipleRegistrationsDto
) {
  let newRegistrations;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );

    newRegistrations = await service.createMultipleRegistrations(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  const redirectPath = newRegistrations.event
    ? `/eventos/${newRegistrations.event?.id}`
    : newRegistrations.eventGroup?.eventGroupType === "free"
      ? `/eventos/serie/${newRegistrations.eventGroup?.id}`
      : `/eventos/campeonatos/${newRegistrations.eventGroup?.id}`;

  return ActionResponse.success({
    redirect: redirectPath,
  });
}

export async function readRegistrations(request: ReadRegistrationsDto) {
  try {
    const registrations = await service.readRegistrations(request);
    return ActionResponse.success({
      data: registrations,
      message: "Inscrições encontradas",
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
}

export async function cancelRegistration(request: { registrationId: string }) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );

    const cancelledRegistration = await service.updateRegistrationStatus({
      ...parsedRequest,
      status: "cancelled",
    });
    revalidatePath("/perfil");
    return ActionResponse.success({
      message: "Inscrição cancelada com sucesso.",
      data: cancelledRegistration,
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
