"use server";

import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { ActionResponse } from "odinkit";
import * as service from "./service";
import { revalidatePath } from "next/cache";
import {
  UpsertCategoryDocumentsDto,
  UpsertEventModalityCategoriesDto,
} from "./dto";

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

export async function upsertCategoryDocuments(
  request: UpsertCategoryDocumentsDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    const upsertedDocuments =
      await service.upsertCategoryDocuments(parsedRequest);

    const isEventGroup = upsertedDocuments.category?.EventModality.eventGroup;

    const modalityId = upsertedDocuments.category?.EventModality.id;

    revalidatePath(
      isEventGroup
        ? `/painel/eventos/grupos/${upsertedDocuments.category?.EventModality.eventGroupId}/modalidades/${modalityId}`
        : `/painel/eventos/${upsertedDocuments.category?.EventModality.eventId}/modalidades/${modalityId}`
    );

    return ActionResponse.success({
      data: upsertedDocuments,
      message: "Documentos atualizados com sucesso",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
