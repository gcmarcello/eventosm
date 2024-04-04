"use server";

import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import {
  ConnectRegistrationToTeamDto,
  CreateMultipleRegistrationsDto,
  ReadRegistrationsDto,
  UpdateRegistrationDto,
} from "./dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { ActionResponse } from "odinkit";
import * as eventGroupService from "./eventGroups/eventGroup.service";
import * as service from "./service";
import { revalidatePath } from "next/cache";
import {
  EventGroupCreateMultipleRegistrationsDto,
  EventGroupCreateRegistrationDto,
} from "./eventGroups/eventGroup.dto";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { EventCreateRegistrationDto } from "./events/event.dto";

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

    await service.updateRegistrationStatus({
      ...parsedRequest,
      status: "cancelled",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    message: "Inscrição cancelada com sucesso.",
    redirect: encodeURI(
      "/perfil?alert=success&message=Inscrição cancelada com sucesso!"
    ),
  });
}

export async function connectRegistrationToTeam(
  request: ConnectRegistrationToTeamDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );

    const registration = await service.connectRegistrationToTeam(parsedRequest);
    revalidatePath("/perfil");
    return ActionResponse.success({
      message: `Inscrição conectada à equipe ${registration.team?.name} com sucesso.`,
      data: registration,
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function updateRegistration(request: UpdateRegistrationDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    const updatedRegistration =
      await service.updateEventGroupRegistration(request);
    revalidatePath(
      `/painel/eventos/grupos/${updatedRegistration.eventGroup?.id}/inscritos`
    );
    return ActionResponse.success({
      data: updatedRegistration,
      message: "Inscrição atualizada com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function resendEventGroupRegistrationConfirmation(id: string) {
  try {
    const { request: parsedRequest } = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    await eventGroupService.resendEventGroupRegistrationConfirmation(id);
    return ActionResponse.success({
      data: id,
      message: "Confirmação de inscrição reenviada com sucesso.",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
