"use server";
import { ActionResponse } from "odinkit";
import { CreateGalleryPhotosDto, UpsertGalleryDto } from "./dto";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";

export async function upsertGallery(request: UpsertGalleryDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    await service.upsertGallery(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error({ error });
  }

  return ActionResponse.success({ redirect: `/painel/galerias/` });
}
