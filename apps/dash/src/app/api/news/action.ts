"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UpsertNewsDto } from "./dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import * as service from "./service";
import { ActionResponse } from "odinkit";

export async function upsertNews(request: UpsertNewsDto) {
  let upsertedNews;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    upsertedNews = await service.upsertNews(parsedRequest);
    if (parsedRequest.id)
      return ActionResponse.success({
        data: upsertedNews,
        message: "Notícia atualizada com sucesso!",
      });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: "/painel/noticias",
    message: "Notícia criada com sucesso!",
  });
}
