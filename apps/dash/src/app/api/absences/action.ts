"use server";

import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import * as service from "./service";
import { CreateAbsenceJustificationDto, UpdateAbsenceStatusDto } from "./dto";
import { ActionResponse } from "odinkit";
import { revalidatePath } from "next/cache";

export async function changeAbsenceStatus(request: UpdateAbsenceStatusDto) {
  const { request: parsedRequest } = await UseMiddlewares(request)
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  try {
    const updateAbsenceStatus =
      await service.changeAbsenceStatus(parsedRequest);
    revalidatePath(
      `/painel/eventos/grupos/[id]/etapas/[eventid]/faltas `,
      "page"
    );
    return ActionResponse.success({ data: updateAbsenceStatus });
  } catch (error) {
    console.log(error);
    return ActionResponse.error({ message: error });
  }
}

export async function updateAbsenceJustification(
  request: CreateAbsenceJustificationDto<"server">
) {
  const { request: parsedRequest } = await UseMiddlewares(request).then(
    UserSessionMiddleware
  );

  try {
    const updatedAbsenceJustification =
      await service.updateAbsenceJustification(parsedRequest);
    return ActionResponse.success({ data: updatedAbsenceJustification });
  } catch (error) {
    console.log(error);
    return ActionResponse.error({ message: error });
  }
}

export async function readAbsenceJustification(request: { id: string }) {
  const { request: parsedRequest } = await UseMiddlewares(request).then(
    UserSessionMiddleware
  );

  try {
    const userDocument = await service.readAbsenceJustification(parsedRequest);
    return ActionResponse.success({ data: userDocument });
  } catch (error) {
    console.log(error);
    return ActionResponse.error({ message: error });
  }
}
