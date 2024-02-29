"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UpsertEventAddonDto } from "./dto";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { ActionResponse } from "odinkit";
import { revalidatePath } from "next/cache";

export async function upsertEventAddon(request: UpsertEventAddonDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    const upsertedAddon = await service.upsertEventAddon(parsedRequest);
    revalidatePath(`/painel/eventos/grupos/${request.eventGroupId}`);
    return ActionResponse.success({
      message: request.id
        ? "Kit atualizado com sucesso."
        : "Kit criado com sucesso.",
      data: upsertedAddon,
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
