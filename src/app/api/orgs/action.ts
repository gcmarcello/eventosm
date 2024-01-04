import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../_shared/utils/ActionResponse";
import { CreateOrganizationDto } from "./dto";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";

export async function createOrganization(request: CreateOrganizationDto) {
  let organization;
  try {
    const { request: parsedRequest } =
      await UseMiddlewares(request).then(UserSessionMiddleware);
    organization = await service.createOrganization(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    data: organization,
    redirect: `/painel/`,
    message: "Organização criada com sucesso!",
  });
}
