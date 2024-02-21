"use server";

import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UpsertEventModalityCategoriesDto } from "../events/dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { ActionResponse } from "odinkit";
import * as service from "./service";
import { revalidatePath } from "next/cache";

export async function upsertEventModalityCategories(
  request: UpsertEventModalityCategoriesDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    const upsertedCategories =
      await service.upsertEventModalityCategories(parsedRequest);

    revalidatePath(`/painel/eventos/${upsertedCategories.eventId}`);

    return ActionResponse.success({
      data: upsertedCategories.categories,
      message: "Categorias atualizadas com sucesso",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
