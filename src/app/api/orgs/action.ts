"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../_shared/utils/ActionResponse";
import { CreateOrganizationDto } from "./dto";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createOrganization(request: CreateOrganizationDto) {
  let organization;
  try {
    const { request: parsedRequest } =
      await UseMiddlewares(request).then(UserSessionMiddleware);
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

export async function changeActiveOrganization(orgId: string) {
  try {
    cookies().set("activeOrg", orgId);
  } catch (error) {
    console.log(error);
  }
}
