"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import {
  ReadEventGroupDto,
  ReadEventTypeDto,
  UpdateEventStatusDto,
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

export async function upsertEventGroup(request: UpsertEventGroupDto) {
  let newEvent;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    newEvent = await service.upsertEventGroup(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error({
      message: "Erro ao criar evento.",
    });
  }

  if (!request.id) {
    return ActionResponse.success({
      redirect: `/painel/eventos/`,
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
  let newEvent;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    newEvent = await service.upsertEvent(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  if (!request.id || !request.eventGroupId) {
    return ActionResponse.success({
      redirect: `/painel/eventos/`,
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

export async function updateEventStatus(request: UpdateEventStatusDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    const event = await service.updateEventStatus(parsedRequest);
    revalidatePath(`/painel/eventos/${request.id}`);
    return ActionResponse.success({
      data: event,
      message: "Status do evento atualizado.",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
