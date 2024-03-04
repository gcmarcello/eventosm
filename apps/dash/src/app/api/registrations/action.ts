"use server";

import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { CreateMultipleRegistrationsDto, ReadRegistrationsDto } from "./dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { ActionResponse } from "odinkit";
import * as eventGroupService from "./eventGroups/eventGroup.service";
import * as service from "./service";
import { revalidatePath } from "next/cache";
import {
  EventGroupCreateMultipleRegistrationsDto,
  EventGroupCreateRegistrationDto,
} from "./eventGroups/eventGroup.dto";

export async function createEventGroupIndividualRegistration(
  request: EventGroupCreateRegistrationDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    await eventGroupService.createEventGroupRegistration(parsedRequest);
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
      await eventGroupService.createEventGroupMultipleRegistrations(
        parsedRequest
      );
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: "/perfil",
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
