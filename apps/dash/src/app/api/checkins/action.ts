"use server";
import { ActionResponse } from "odinkit";
import { SubeventEventGroupCheckinDto } from "./dto";
import * as service from "./service";

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
  try {
    const data = await service.eventGroupSubeventCheckin(request);
    return ActionResponse.success({ data });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
