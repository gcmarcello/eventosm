"use server";
import { ActionResponse } from "odinkit";
import { DeleteModalityDto } from "./dto";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { revalidatePath } from "next/cache";

export async function deleteModality(request: DeleteModalityDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    const deletedModality = await service.deleteModality(parsedRequest);
    revalidatePath(
      deletedModality[2].eventGroupId
        ? `/painel/eventos/grupos/${deletedModality[2].eventGroupId}/modalidades`
        : `/painel/eventos/${deletedModality[2].eventId}/modalidades`
    );
    return ActionResponse.success({ data: deletedModality[2] });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function readEventModalities(eventId: string) {
  try {
    const modalities = await service.readEventModalities(eventId);
    return ActionResponse.success({ data: modalities });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
