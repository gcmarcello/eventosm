"use server";
import { ActionResponse } from "odinkit";
import { SubeventEventGroupCheckinDto } from "./dto";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";

export async function readEventGroupRegistrationCheckin(
  request: SubeventEventGroupCheckinDto
) {
  try {
    const data = await service.readEventGroupRegistrationCheckin(request);
    return ActionResponse.success({ data });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function eventGroupSubeventCheckin(
  request: SubeventEventGroupCheckinDto
) {
  const { request: parsedRequest } = await UseMiddlewares(request).then(
    UserSessionMiddleware
  );
  try {
    const data = await service.eventGroupSubeventCheckin(parsedRequest);
    return ActionResponse.success({ data });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
