"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import {
  ReadEventDto,
  ReadEventGroupCheckinsAndAbsencesDto,
  ReadEventGroupDto,
  ReadEventTypeDto,
  UpsertEventDto,
  UpsertEventGroupDto,
  UpsertEventModalityCategoriesDto,
  UpsertEventModalityDto,
} from "./dto";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { upsertEventModalityCategories } from "../categories/service";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "odinkit";
import { UpdateEventStatusDto } from "./status/dto";
import { useHeaders } from "../_shared/utils/useHeaders";
import { Event } from "@prisma/client";

export async function readEventGroups(request: ReadEventGroupDto) {
  try {
    const eventGroups = await service.readEventGroups(request);

    return ActionResponse.success({
      data: eventGroups,
    });
  } catch (err) {
    return ActionResponse.error({
      message: err,
    });
  }
}

export async function readEventGroupCheckinsAndAbsences(
  request: ReadEventGroupCheckinsAndAbsencesDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );

    const eventGroups =
      await service.readEventGroupCheckinsAndAbsences(parsedRequest);

    return ActionResponse.success({
      data: eventGroups,
    });
  } catch (err) {
    return ActionResponse.error({
      message: err,
    });
  }
}

export async function upsertEventGroup(request: UpsertEventGroupDto) {
  let newEvent;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    newEvent = await service.upsertEventGroup(parsedRequest);
  } catch (error) {
    return ActionResponse.error(error);
  }

  if (!request.id) {
    return ActionResponse.success({
      redirect: `/painel/eventos/grupos/${newEvent.id}`,
      message: "Evento criado com sucesso.",
    });
  } else {
    revalidatePath(`/painel/eventos/${request.id}`);
    return ActionResponse.success({
      data: newEvent,
      message: "Evento atualizado com sucesso.",
    });
  }
}

export async function upsertEvent(request: UpsertEventDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    const newEvent = await service.upsertEvent(parsedRequest);

    if (request.eventGroupId) {
      revalidatePath(`/painel/eventos/grupos/${request.eventGroupId}`);
      return ActionResponse.success({
        data: newEvent,
        message: "Evento atualizado com sucesso.",
      });
    }
  } catch (error) {
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: `/painel/eventos/`,
    message: "Evento criado com sucesso.",
  });
}

export async function upsertEventModality(request: UpsertEventModalityDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    const newEventModality = await service.upsertEventModality(parsedRequest);
    revalidatePath(`/painel/eventos/${request.eventId}`);
    return ActionResponse.success({
      data: newEventModality,
      message: "Modalidade criada com sucesso.",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error({
      message: "Erro ao criar modalidade.",
    });
  }
}

export async function upsertEventModalityCategory(
  request: UpsertEventModalityCategoriesDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    const newEventModalityCategory =
      await upsertEventModalityCategories(parsedRequest);
    return ActionResponse.success({
      data: newEventModalityCategory,
      message: "Categoria criada com sucesso.",
    });
  } catch (error) {
    return ActionResponse.error({
      message: "Erro ao criar categoria.",
    });
  }
}

export async function readSubeventReviewData(request: { eventId: string }) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    const data = await service.readSubeventReviewData(parsedRequest);
    return ActionResponse.success({
      data,
      message: "Dados de revisão carregados com sucesso.",
    });
  } catch (error) {
    return ActionResponse.error({
      message: "Erro ao buscar dados de revisão.",
    });
  }
}

export async function readEventFulltext(request: ReadEventDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    if (!parsedRequest)
      throw "Informações não encontradas. Por favor, tente novamente.";

    const events = await service.readEventFulltext(parsedRequest);

    return ActionResponse.success({ data: events as Event[] });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readEventGroupFulltext(request: ReadEventDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    if (!parsedRequest)
      throw "Informações não encontradas. Por favor, tente novamente.";

    const eventGroups = await service.readEventGroupFulltext(parsedRequest);

    return ActionResponse.success({ data: eventGroups as Event[] });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
