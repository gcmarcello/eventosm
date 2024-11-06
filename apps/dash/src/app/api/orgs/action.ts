"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import {
  UpdateOrganizationStyleDto,
  UpsertOrganizationDocumentDto,
  UpsertOrganizationDto,
} from "./dto";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { cookies } from "next/headers";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "odinkit";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";

export async function createOrganization(request: UpsertOrganizationDto) {
  let organization;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    organization = await service.createOrganization(parsedRequest);
    cookies().set("activeOrg", organization.id);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: `/painel`,
  });
}

export async function updateOrganization(request: UpsertOrganizationDto) {
  let organization;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    organization = await service.updateOrganization(parsedRequest);
    revalidatePath(`/painel/configuracoes`);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    message: "Organização atualizada com sucesso.",
    data: organization,
  });
}

export async function updateOrganizationStyle(
  request: UpdateOrganizationStyleDto
) {
  let organization;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    organization = await service.updateOrganizationStyle(parsedRequest);
    revalidatePath(`/painel/configuracoes`);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    message: "Organização atualizada com sucesso.",
    data: organization,
  });
}

export async function upsertOrganizationDocument(
  request: UpsertOrganizationDocumentDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);

    const document = await service.upsertOrganizationDocument(parsedRequest);
    revalidatePath(`/painel/documentos`);
    return ActionResponse.success({
      data: document,
      message: request.id
        ? "Documento atualizado com sucesso."
        : "Documento criado com sucesso.",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function readOrganizationDocument(request: { id: string }) {
  const { request: parsedRequest } = await UseMiddlewares(request).then(
    OptionalUserSessionMiddleware
  );

  try {
    const url = await service.readOrganizationDocument(parsedRequest);
    return ActionResponse.success({ data: url });
  } catch (error) {
    return ActionResponse.error(error);
  }
}

export async function changeActiveOrganization(orgId: string) {
  try {
    cookies().set("activeOrg", orgId);
  } catch (error) {
    console.log(error);
  }
}
